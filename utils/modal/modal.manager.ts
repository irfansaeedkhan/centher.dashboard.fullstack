import { IModalHandler, TemplateCollection } from "./interfaces";
import { TemplateFactory } from "./template.factory";

export class ModalManager {
  _setModalModel: any;
  _templates: TemplateCollection;

  constructor(setModalModel: any, templates: TemplateCollection = {}) {
    this._setModalModel = setModalModel;
    this._templates = templates;
  }

  dismissModal(): void {
    this.modalHandler({ visibility: false, title: "", content: "" });
  }

  createModal(
    type: any,
    params?: any,
    useDefaultTemplate: boolean = false
  ): void {
    let template = this.getModalModel(type, useDefaultTemplate);
    if (!template) {
      throw new Error(`Template for type ${type} not found.`);
    }

    if (typeof template.content == "function") {
      template.content = template.content(params);
    } else {
      template.content = template.content;
    }

    this.modalHandler(template);
  }

  private getModalModel(
    type: string,
    useDefaultTemplate: boolean
  ): IModalHandler | null {
    if (useDefaultTemplate) {
      return this.getExistingTemplates(type);
    } else {
      if (!this._templates) {
        throw new Error("Modal templates is empty");
      }
      return this._templates[type] ? this._templates[type] : null;
    }
  }

  private modalHandler(input: IModalHandler): void {
    if (input.visibility && !input.title?.length && !input.content?.length) {
      throw new Error("Invalid modal configuration.");
    }

    this._setModalModel(input);
  }

  private getExistingTemplates(type: string): IModalHandler | null {
    return TemplateFactory(type);
  }
}
