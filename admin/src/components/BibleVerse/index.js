import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Field,
  FieldHint,
  FieldError,
  FieldLabel,
  FieldInput,
} from "@strapi/design-system";
import chapterAndVerse from "chapter-and-verse/js/cv";
import { getPassage, BOOKS } from "../../utils/helper";
import { Hint } from "react-autocomplete-hint";
import { useIntl } from "react-intl";

const BibleVerse = ({
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
}) => {
  const books = BOOKS;
  const [bibleVerse, setBibleVerse] = useState("");
  const [content, setContent] = useState("");
  const { formatMessage } = useIntl();

  useEffect(() => {
    const cv = chapterAndVerse(bibleVerse);
    if (!cv) return;
    if (cv.success) {
      error.pop(0);
      setContent(getPassage(cv));
    } else {
      error[0] = cv.reason;
    }
  }, [bibleVerse]);

  function handleChange(e) {
    onChange(e);
    setBibleVerse(e.target.value);
  }

  return (
    <Field
      name={name}
      id={name}
      // GenericInput calls formatMessage and returns a string for the error
      error={error}
      hint={description && formatMessage(description)}
      // required={required}
    >
      <FieldLabel action={labelAction}>{formatMessage(intlLabel)}</FieldLabel>
      <Hint allowTabFill={true} options={books}>
        <FieldInput
          id={"bible-verse-picker-value"}
          onChange={handleChange}
          value={value}
          placeholder="Ex: Gen 1:1, Genesis 1:1-5, Genesis 1, Genesis"
        />
      </Hint>
      <FieldHint />
      <FieldError />
      <div
        style={{ textAlign: "justify" }}
        dangerouslySetInnerHTML={{ __html: content }}
      ></div>
    </Field>
  );
};

BibleVerse.defaultProps = {
  errors: [],
  inputDescription: null,
  label: "",
  noErrorsDescription: false,
  value: "",
};

BibleVerse.propTypes = {
  errors: PropTypes.array,
  inputDescription: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.shape({
      id: PropTypes.string,
      params: PropTypes.object,
    }),
  ]),
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.shape({
      id: PropTypes.string,
      params: PropTypes.object,
    }),
  ]),
  name: PropTypes.string.isRequired,
  noErrorsDescription: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
};

export default BibleVerse;
