import { IModalHandler, TemplateCollection } from "./interfaces";

export function TemplateFactory(type: string): IModalHandler | null {
  if (type in templates) {
    return templates[type];
  } else {
    return null;
  }
}

const templates: TemplateCollection = {
  // write templates here
  // test: {
  //   title: "test",
  //   visibility: true,
  //   content: (testParam) => {},
  // },
};
