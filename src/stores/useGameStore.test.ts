import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useGameStore } from './useGameStore';
import { act } from '@testing-library/react';

// Mock Supabase to avoid network calls
vi.mock('../lib/supabase', () => ({
    supabase: {
        auth: {
            getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user' } } }),
        },
        from: vi.fn().mockReturnValue({
            insert: vi.fn().mockResolvedValue({}),
        }),
    },
}));

vi.mock('../lib/problemService', () => ({
    fetchSupabaseProblems: vi.fn().mockResolvedValue([]),
}));

describe('useGameStore', () => {
    beforeEach(() => {
        // Reset store before each test
        const initialState = useGameStore.getInitialState();
        useGameStore.setState(initialState, true);
    });

    it('should initialize with default values', () => {
        const state = useGameStore.getState();
        expect(state.score).toBe(0);
        expect(state.difficulty).toBe('Normal');
        expect(state.userAnswer).toBe('');
    });

    it('generateProblem should set a problem', () => {
        const store = useGameStore.getState();

        act(() => {
            store.generateProblem();
        });

        const newState = useGameStore.getState();
        expect(newState.currentProblem).not.toBeNull();
        expect(newState.currentProblemPoints).toBe(100);
        expect(newState.status).toBe('idle');
    });

    it('insertChar should update userAnswer', () => {
        const store = useGameStore.getState();

        act(() => {
            store.insertChar('1');
            store.insertChar('2');
        });

        expect(useGameStore.getState().userAnswer).toBe('12');
    });

    it('backspace should remove last char', () => {
        const store = useGameStore.getState();

        act(() => {
            store.insertChar('1');
            store.insertChar('2');
            store.backspace();
        });

        expect(useGameStore.getState().userAnswer).toBe('1');
    });

    it('handleCheck should handle correct answer', async () => {
        const store = useGameStore.getState();

        act(() => {
            store.generateProblem();
        });

        const problem = useGameStore.getState().currentProblem;
        if (!problem) throw new Error('Problem not generated');

        // Set correct answer
        act(() => {
            useGameStore.setState({ userAnswer: problem.problem.correct_answer });
        });

        await act(async () => {
            await store.handleCheck();
        });

        const newState = useGameStore.getState();
        expect(newState.status).toBe('correct');
        expect(newState.score).toBeGreaterThan(0);
    });

    it('handleCheck should handle incorrect answer', async () => {
        const store = useGameStore.getState();

        act(() => {
            store.generateProblem();
        });

        // Set incorrect answer
        act(() => {
            useGameStore.setState({ userAnswer: 'incorrect_value_999' });
        });

        await act(async () => {
            await store.handleCheck();
        });

        const newState = useGameStore.getState();
        expect(newState.status).toBe('incorrect');
        expect(newState.streak).toBe(0);
        expect(newState.wrongAnswers.length).toBe(1);
    });
});
