// ふりがな（ルビ）辞書 — 数学用語を中心に
// { 漢字: 読み } の形式

const FURIGANA_DICT: Record<string, string> = {
    // 数学基礎
    '比例': 'ひれい',
    '反比例': 'はんぴれい',
    '方程式': 'ほうていしき',
    '変数': 'へんすう',
    '定数': 'ていすう',
    '座標': 'ざひょう',
    '原点': 'げんてん',
    '関数': 'かんすう',
    '式': 'しき',
    '値': 'あたい',
    '計算': 'けいさん',
    '答': 'こたえ',
    '問題': 'もんだい',
    '解': 'かい',
    '正解': 'せいかい',

    // 図形
    '図形': 'ずけい',
    '平面図形': 'へいめんずけい',
    '直線': 'ちょくせん',
    '三角形': 'さんかくけい',
    '四角形': 'しかくけい',
    '正五角形': 'せいごかくけい',
    '台形': 'だいけい',
    '内角': 'ないかく',
    '角度': 'かくど',
    '底辺': 'ていへん',
    '高さ': 'たかさ',
    '上底': 'じょうてい',
    '下底': 'かてい',
    '面積': 'めんせき',
    '半径': 'はんけい',
    '円周': 'えんしゅう',
    '円周率': 'えんしゅうりつ',
    '弧': 'こ',
    '中心角': 'ちゅうしんかく',

    // 移動
    '平行移動': 'へいこういどう',
    '対称移動': 'たいしょういどう',
    '回転': 'かいてん',
    '反時計回り': 'はんとけいまわり',
    '符号': 'ふごう',

    // 単位
    '度': 'ど',

    // その他
    '求め': 'もとめ',
};

// 辞書をキーの長い順にソート（「正五角形」を「形」より先にマッチさせるため）
const SORTED_KEYS = Object.keys(FURIGANA_DICT).sort((a, b) => b.length - a.length);

export interface FuriganaSegment {
    text: string;
    ruby?: string;
}

/**
 * テキストをふりがな付きセグメントに分割する
 */
export function parseFurigana(text: string): FuriganaSegment[] {
    const segments: FuriganaSegment[] = [];
    let remaining = text;

    while (remaining.length > 0) {
        let matched = false;

        for (const key of SORTED_KEYS) {
            if (remaining.startsWith(key)) {
                segments.push({ text: key, ruby: FURIGANA_DICT[key] });
                remaining = remaining.slice(key.length);
                matched = true;
                break;
            }
        }

        if (!matched) {
            // ふりがな不要な文字
            if (segments.length > 0 && !segments[segments.length - 1].ruby) {
                segments[segments.length - 1].text += remaining[0];
            } else {
                segments.push({ text: remaining[0] });
            }
            remaining = remaining.slice(1);
        }
    }

    return segments;
}
