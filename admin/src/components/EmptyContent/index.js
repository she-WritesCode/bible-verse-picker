import React, { useCallback, useEffect, useMemo, useRef, useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { Label, InputDescription, InputTextArea } from 'strapi-helper-plugin';
import { useParams } from 'react-router';
import chapterAndVerse from 'chapter-and-verse/js/cv';
import { getPassage } from "../../utils/helper";

const EmptyContent = ({
  inputDescription,
  errors,
  label,
  name,
  noErrorsDescription,
  onChange,
  value,
}) => {
  const params = useParams();
  const [currentValue, setCurrentValue] = useState(value)

  function getCurrentData() {
    fetch(`${strapi.backendURL}/bible-studies/${params.id}`).then(async (response) => {
      const data = await response.json()
      const cv = chapterAndVerse(data.bibletext[0].name)
      if (cv.success) {
        setCurrentValue(getPassage(cv));
      } else {
        setCurrentValue("");
      }
    })
  }

  // setInterval(() => getCurrentData, 30000);

  return (
    <div
      style={{
        marginBottom: '1.6rem',
        fontSize: '1.3rem',
        fontFamily: 'Lato',
      }}
      onClick={getCurrentData}
    >
      <Label htmlFor={name} message={`${label} (this wiil update when you click it)`} /> <br />

      <InputDescription
        message={inputDescription}
        style={!isEmpty(inputDescription) ? { marginTop: '1.4rem' } : {}}
      />

      <InputTextArea value={currentValue} disabled={true} />

    </div>
  );
};

EmptyContent.defaultProps = {
  errors: [],
  inputDescription: null,
  label: '',
  noErrorsDescription: false,
  value: '',
};

EmptyContent.propTypes = {
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

export default EmptyContent;
