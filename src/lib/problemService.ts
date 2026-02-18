// ハイブリッド問題サービス
// JSON（バンドル）+ Supabase（追加問題）を統合

import { supabase } from './supabase';
import { GeneratedProblem } from '../data/mockProblems';
import { GeometryProblem } from '../data/geometryProblems';

type AnyProblem = GeneratedProblem | GeometryProblem;

// ============================================
// Supabase → GeneratedProblem 変換
// ============================================

interface SupabaseProblemRow {
    id: string;
    genre: string;
    difficulty: string;
    unit: string;
    points: number;
    problem_text: string;
    correct_answer: string;
    answer_variants: string[];
    hints: string[];
    chips: string[];
    is_approved: boolean;
    created_by: string;
}

function rowToProblem(row: SupabaseProblemRow): AnyProblem {
    const base = {
        id: `db-${row.id}`,
        meta: {
            difficulty: row.difficulty as 'Easy' | 'Normal' | 'Hard' | 'Expert',
            points: row.points,
            unit: row.unit,
        },
        problem: {
            text: row.problem_text,
            correct_answer: row.correct_answer,
            answer_variants: row.answer_variants || [],
        },
        hints: row.hints || [],
        chips: row.chips || [],
    };

    if (row.genre === 'geometry' || row.genre === 'sector') {
        return {
            ...base,
            meta: { ...base.meta, unit: row.unit as any, genre: 'geometry' as const },
        } as GeometryProblem;
    }

    return base as GeneratedProblem;
}

// ============================================
// 問題の取得
// ============================================

/**
 * Supabase から承認済みの追加問題を取得
 */
export async function fetchSupabaseProblems(
    genre?: string,
    difficulty?: string
): Promise<AnyProblem[]> {
    if (!supabase) return [];

    try {
        let query = supabase
            .from('problems')
            .select('*')
            .eq('is_approved', true);

        if (genre) query = query.eq('genre', genre);
        if (difficulty) query = query.eq('difficulty', difficulty);

        const { data, error } = await query;
        if (error) {
            console.warn('[ProblemService] Supabase fetch error:', error.message);
            return [];
        }

        return (data || []).map(rowToProblem);
    } catch {
        console.warn('[ProblemService] Supabase not available, using local only');
        return [];
    }
}

/**
 * ユーザーが作成した問題を取得（未承認含む）
 */
export async function fetchMyProblems(): Promise<(AnyProblem & { isApproved: boolean; rawId: string })[]> {
    if (!supabase) return [];

    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
            .from('problems')
            .select('*')
            .eq('created_by', user.id)
            .order('created_at', { ascending: false });

        if (error) return [];

        return (data || []).map(row => ({
            ...rowToProblem(row),
            isApproved: row.is_approved,
            rawId: row.id,
        }));
    } catch {
        return [];
    }
}

// ============================================
// 問題の登録
// ============================================

export interface NewProblemInput {
    genre: string;
    difficulty: string;
    unit: string;
    points: number;
    problemText: string;
    correctAnswer: string;
    answerVariants: string[];
    hints: string[];
    chips: string[];
}

/**
 * 新しい問題を Supabase に登録
 */
export async function addProblem(input: NewProblemInput): Promise<{ success: boolean; error?: string }> {
    if (!supabase) {
        return { success: false, error: 'Supabase が接続されていません' };
    }

    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { success: false, error: 'ログインが必要です' };
        }

        const { error } = await supabase
            .from('problems')
            .insert({
                genre: input.genre,
                difficulty: input.difficulty,
                unit: input.unit,
                points: input.points,
                problem_text: input.problemText,
                correct_answer: input.correctAnswer,
                answer_variants: input.answerVariants,
                hints: input.hints,
                chips: input.chips,
                created_by: user.id,
                is_approved: false, // 初期状態は未承認
            });

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (e) {
        return { success: false, error: '問題の登録に失敗しました' };
    }
}

/**
 * 問題を削除
 */
export async function deleteProblem(problemId: string): Promise<{ success: boolean; error?: string }> {
    if (!supabase) return { success: false, error: 'Supabase 未接続' };

    const { error } = await supabase
        .from('problems')
        .delete()
        .eq('id', problemId);

    if (error) return { success: false, error: error.message };
    return { success: true };
}
