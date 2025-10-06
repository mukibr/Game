document.addEventListener('DOMContentLoaded', () => {
    const puzzleContainer = document.getElementById('puzzle-container');
    const shuffleButton = document.getElementById('shuffle-button');
    const movesSpan = document.getElementById('moves');

    const TILE_COUNT = 16;
    const GRID_SIZE = 4;
    let tiles = [];
    let moves = 0;

    // パズルの初期化
    function init() {
        // タイルの配列を作成 (1から15と、空のタイルnull)
        tiles = Array.from({ length: TILE_COUNT - 1 }, (_, i) => i + 1);
        tiles.push(null); // nullを空のタイルとする

        moves = 0;
        updateMoves();
        shuffle();
        render();
    }

    // パズル盤面を描画
    function render() {
        puzzleContainer.innerHTML = '';
        for (let i = 0; i < TILE_COUNT; i++) {
            const tileValue = tiles[i];
            const tile = document.createElement('div');
            tile.classList.add('tile');

            if (tileValue === null) {
                tile.classList.add('empty');
            } else {
                tile.textContent = tileValue;
                tile.addEventListener('click', () => onTileClick(i));
            }
            puzzleContainer.appendChild(tile);
        }
    }

    // タイルがクリックされたときの処理
    function onTileClick(index) {
        const emptyIndex = tiles.indexOf(null);
        const { row, col } = getRowCol(index);
        const { row: emptyRow, col: emptyCol } = getRowCol(emptyIndex);

        // 空のタイルが隣接しているかチェック
        if (
            (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
            (Math.abs(col - emptyCol) === 1 && row === emptyRow)
        ) {
            // タイルを入れ替える
            [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
            moves++;
            updateMoves();
            render();
            checkWin();
        }
    }

    // シャッフル機能
    function shuffle() {
        // Fisher-Yatesアルゴリズムでシャッフル
        for (let i = tiles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
        }
        // TODO: ここでは必ず解ける配置になる保証はありません。
        //       より高度な実装では、解ける配置のみを生成するロジックが必要です。
    }

    // クリア判定
    function checkWin() {
        // 最後のタイルが空(null)であることを確認
        if (tiles[TILE_COUNT - 1] !== null) return;

        for (let i = 0; i < TILE_COUNT - 1; i++) {
            if (tiles[i] !== i + 1) {
                return; // 順番が違えば終了
            }
        }
        // ループを抜けたらクリア
        setTimeout(() => {
            alert(`クリア！ おめでとうございます！\n手数: ${moves}回`);
            init(); // ゲームをリセット
        }, 100);
    }
    
    // 手数を更新
    function updateMoves() {
        movesSpan.textContent = moves;
    }

    // インデックスから行と列を取得
    function getRowCol(index) {
        return {
            row: Math.floor(index / GRID_SIZE),
            col: index % GRID_SIZE,
        };
    }

    // シャッフルボタンのイベントリスナー
    shuffleButton.addEventListener('click', init);

    // ゲーム開始
    init();
});
