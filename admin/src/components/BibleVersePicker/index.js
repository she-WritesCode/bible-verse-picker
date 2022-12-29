import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  Field,
  FieldHint,
  FieldError,
  FieldLabel,
  FieldInput,
  Select,
  Option,
  Stack,
  Box,
} from "@strapi/design-system";
import chapterAndVerse from "chapter-and-verse/js/cv";
import { getPassage, BOOKS } from "../../utils/helper";
import { useIntl } from "react-intl";

function BibleVersePicker({
  attribute,
  description,
  disabled,
  error,
  intlLabel,
  labelAction,
  name,
  onChange,
  required,
  value,
}) {
  const books = BOOKS;
  const [actualValue, setActualValue] = useState(value);
  const [chapterList, setChapterList] = useState([1]);
  const [bibleCv, setBibleCv] = useState(chapterAndVerse(value || books[0]));
  const [book, setBook] = useState(
    bibleCv?.book ? bibleCv?.book?.name : books[0]
  );
  const [chapter, setChapter] = useState(bibleCv?.chapter || 1);
  const [verse, setVerse] = useState(`${bibleCv?.from}-${bibleCv?.to}`);
  const [content, setContent] = useState(getPassage(bibleCv));
  const { formatMessage } = useIntl();
  const verseInputRef = useRef();

  useEffect(() => {
    if (actualValue) return;
    let cv = chapterAndVerse(book);
    if (!cv) return;
    const chapterLength = cv.book.chapters;
    setChapterList([...Array(chapterLength + 1).keys()].slice(1));
    const defaultVerse = `1-${cv.book.versesPerChapter[0]}`;
    const defaultChapter = 1;
    setVerse(defaultVerse);
    setChapter(defaultChapter);
    cv = chapterAndVerse(`${book} ${defaultChapter}:${defaultVerse}`);
    if (!cv) return;
    if (cv.success) setBibleCv(cv);
    setContent(getPassage(cv));
  }, [book]);
  useEffect(() => {
    const cv = chapterAndVerse(actualValue || book);
    if (!cv) return;
    setBibleCv(cv);
    const chapterLength = cv.book.chapters;
    setChapterList([...Array(chapterLength + 1).keys()].slice(1));
    setContent(getPassage(cv));
  }, []);

  useEffect(() => {
    if (bibleCv && bibleCv?.success) {
      setActualValue((prev) =>
        bibleCv?.success ? bibleCv?.toShortString() : prev
      );
      setContent(getPassage(bibleCv));
    }
  }, [bibleCv]);

  function handleChapterChange(newChapter) {
    const cv = chapterAndVerse(`${book} ${newChapter}`);
    if (!cv) return;
    setBibleCv(cv.success ? cv : bibleCv);
    setVerse(`1-${cv.book.versesPerChapter[newChapter - 1]}`);
    setChapter(newChapter);
  }

  function handleVerseChange(e) {
    const newVerse = e.target.value;
    // TODO: valid: 1,2,3 // DONE: valid: 1-5 // TODO(Probaly): valid: 1-5, 23 // regex: [0-9],?[0-9]*| [0-9]-[0-9]
    const entry = `${book} ${chapter}${newVerse ? ":" + newVerse : ""}`;
    const cv = chapterAndVerse(entry);
    if (!cv) return;
    setBibleCv(cv.success ? cv : bibleCv);
    if (cv.success === true) {
      error = "";
    }
    if (cv.success === false) {
      let err = entry + " is invalid because " + cv.reason;
      error = err;
    }
    console.log("error", newVerse);
    setVerse(newVerse);
    if (!cv.success) return;
    setActualValue(cv.toShortString());
    onChange({ target: { name, value: cv.toShortString() } });
  }

  return (
    <>
      <Field
        name={name}
        id={name}
        // GenericInput calls formatMessage and returns a string for the error
        error={error}
        hint={description && formatMessage(description)}
        required={required}
        hidden
      >
        <FieldLabel action={labelAction}>{formatMessage(intlLabel)}</FieldLabel>
        <FieldInput
          ref={verseInputRef}
          id={name}
          value={actualValue}
          onChange={onChange}
        ></FieldInput>
        <FieldHint />
        <FieldError />
      </Field>
      <Stack horizontal spacing={4}>
        <Box>
          <Select id="book" label="Book" value={book} onChange={setBook}>
            {books.map((book) => (
              <Option key={book} value={book}>
                {book}
              </Option>
            ))}
          </Select>
        </Box>
        <Box>
          <Select
            id="chapter"
            label="Chapter"
            value={chapter}
            onChange={handleChapterChange}
          >
            {chapterList.map((chapter) => (
              <Option key={chapter} value={chapter}>
                {chapter}
              </Option>
            ))}
          </Select>
        </Box>
        <Box>
          <Field id="verse">
            <FieldLabel>Verse</FieldLabel>
            <FieldInput
              id="verse"
              value={verse}
              onChange={handleVerseChange}
            ></FieldInput>
          </Field>
        </Box>
      </Stack>

      <div
        style={{
          textAlign: "justify",
          margin: "5px auto 0 auto",
          width: "100%",
        }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </>
  );
}

BibleVersePicker.defaultProps = {
  description: null,
  disabled: false,
  error: null,
  labelAction: null,
  required: false,
  value: "",
};

BibleVersePicker.propTypes = {
  intlLabel: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  attribute: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.object,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  labelAction: PropTypes.object,
  required: PropTypes.bool,
  value: PropTypes.string,
};

export default BibleVersePicker;

/*
sample Chapter and verse output:
{
  "book": {
    "id": "Dan",
    "name": "Daniel",
    "testament": "O",
    "start": "dan",
    "abbr": ["da", "dn"],
    "chapters": 12,
    "versesPerChapter": [21, 49, 30, 37, 31, 28, 28, 27, 27, 21, 45, 13]
  },
  "success": true,
  "reason": "matches book.id",
  "chapter": 4,
  "from": 1,
  "to": 3
}
*/
