export const BOOKS =
  "Genesis, Exodus, Leviticus, Numbers, Deuteronomy, Joshua, Judges, Ruth, 1 Samuel, 2 Samuel, 1 Kings, 2 Kings, 1 Chronicles, 2 Chronicles, Ezra, Nehemiah, Esther, Job, Psalms, Proverbs, Ecclesiastes, Song of Solomon, Isaiah, Jeremiah, Lamentations, Ezekiel, Daniel, Hosea, Joel, Amos, Obadiah, Jonah, Micah, Nahum, Habakkuk, Zephaniah, Haggai, Zechariah, Malachi, Matthew, Mark, Luke, John, Acts, Romans, 1 Corinthians, 2 Corinthians, Galatians, Ephesians, Philippians, Colossians, 1 Thessalonians, 2 Thessalonians, 1 Timothy, 2 Timothy, Titus, Philemon, Hebrews, James, 1 Peter, 2 Peter, 1 John, 2 John, 3 John, Jude, Revelation"
    .split(",")
    .map((book) => book.trim());

export function range(min, max) {
  var len = max - min + 1;
  var arr = new Array(len);
  for (var i = 0; i < len; i++) {
    arr[i] = min + i;
  }
  return arr;
}

export function getPassage(bibleCv) {
  const bible = require(`../bible-kjv/${bibleCv.book.name.replace(
    " ",
    ""
  )}.json`);
  const currentChapter = bible.chapters.find(
    (chap) => Number(chap.chapter) === bibleCv.chapter
  );
  if (currentChapter) {
    let selectedVerses = [];
    if (bibleCv.from === null && bibleCv.to === null) {
      selectedVerses = bibleCv.from
        ? [bibleCv.from]
        : range(1, bibleCv.book.versesPerChapter[bibleCv.chapter - 1]);
    } else if (bibleCv.from === bibleCv.to) {
      selectedVerses = bibleCv.from ? [bibleCv.from] : [1];
    } else {
      selectedVerses = range(bibleCv.from, bibleCv.to);
    }

    let text = "";
    text = selectedVerses.map((selectedVerse) => {
      return `${selectedVerse}. ${
        currentChapter.verses.find(
          (vers) => Number(vers.verse) === selectedVerse
        ).text
      }<br/>`;
    });
    text = text.join("");
    return text;
  }
  return "";
}
