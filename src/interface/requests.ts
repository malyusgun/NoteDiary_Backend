import { ISheetDB } from './database';

export interface ISheet {
  user_uuid: string;
  sheet_uuid?: string;
  sheet_title: string;
  sheet_icon?: string;
  sheet_navigation_order?: string;
  sheet_entities?: string[];
}
export interface IUser {
  nick_name: string;
  email: string;
  password: string;
  user_uuid?: string;
  favorite_color: string;
  user_sheets: ISheetDB[];
}
export interface ISheetUuid {
  sheet_uuid: string;
}
export interface IEditSheetBackground {
  sheet_uuid: string;
  background_url: string;
}
interface IEntityUuidAndOrder {
  entity_uuid: string;
  entity_order: number;
  entity_type: 'divider' | 'paragraph' | 'image' | 'table';
}
export interface IChangeEntitiesOrder {
  main: IEntityUuidAndOrder;
  target: IEntityUuidAndOrder;
}
