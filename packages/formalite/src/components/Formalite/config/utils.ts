import { FormikErrors, FormikTouched, FormikValues } from "formik";
import { OptionalObjectSchema } from "yup/lib/object";
import Condition from "yup/lib/Condition";
import get from "lodash-es/get";
import numeral from "numeral";
import { ViewTypes } from "@components/Formalite/Formalite.type";

type GetDataProps = {
  source?: FormikTouched<unknown> | FormikErrors<unknown> | unknown;
  key: string;
};

type CheckIsRequiredProps = {
  schema: OptionalObjectSchema<any>;
  formikValues: FormikValues;
  key: string;
};

export const getData = ({ source, key }: GetDataProps) => {
  return get(source as object, key);
};

export const generateNestedKeyForYup = (key: string) => {
  const splitedKey = key.split(".");
  let generatedKey = `fields.${splitedKey[0]}`;
  splitedKey.forEach((item, index) => {
    if (index !== 0 && index % 2 === 0) {
      generatedKey += `.innerType.fields.${item}`;
    }
  });

  return generatedKey;
};

const generalCheck = (
  { schema, formikValues, key }: CheckIsRequiredProps,
  type: string
) => {
  const generatedKey = generateNestedKeyForYup(key);

  let isRequired = false;
  const fieldSchema = get(schema, generatedKey);

  if (fieldSchema?.conditions?.length > 0) {
    fieldSchema.conditions.every((condition: Condition) => {
      const refValues = condition.refs.map((ref) =>
        getData({ source: formikValues, key: ref.key })
      );

      const newSchema = condition.fn.bind(null, ...refValues, fieldSchema)();
      isRequired = get(newSchema, `exclusiveTests.${type}`);

      return !isRequired;
    });
  } else {
    const value = get(fieldSchema, `exclusiveTests.${type}`);

    isRequired = !!value;
  }

  return isRequired;
};

export const checkIsRequired = ({
  schema,
  formikValues,
  key,
}: CheckIsRequiredProps) => {
  return generalCheck({ schema, formikValues, key }, "required");
};

export const checkIsMin = ({
  schema,
  formikValues,
  key,
}: CheckIsRequiredProps) => {
  return generalCheck({ schema, formikValues, key }, "min");
};

export const showErrorMessage = (error: any) => {
  console.error("Formalite Error", error);
};

export function fData(number: string | number) {
  return numeral(number).format("0.0 b");
}

export const getDefaultValue = (type: ViewTypes) => {
  if (
    [
      ViewTypes.MultiDropZoneView,
      ViewTypes.CheckGroupView,
      ViewTypes.SwitchGroupView,
      ViewTypes.RepeaterView,
    ].includes(type)
  ) {
    return [];
  }

  if (
    [
      ViewTypes.DatePickerView,
      ViewTypes.DateTimePickerView,
      ViewTypes.TimePickerView,
    ].includes(type)
  ) {
    return null;
  }

  return "";
};

export const handleRandomClassNameOrId: () => string = () => {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 5; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

export const checkRegex = ({
  regexs,
  text,
}: {
  regexs: (RegExp | undefined)[] | undefined;
  text: string | undefined;
}) => {
  if (!regexs) {
    return true;
  }
  // const allRegexs = regexs.filter((item) => !!item);
  let testResult = true;
  regexs.forEach((item) => {
    if (item && !item.test(text || "")) {
      testResult = false;
    }
  });
  return testResult;
};
