export interface IWSRequest<T, B> {
  event: T;
  body: B;
}
export interface IBodyPage {
  user_uuid: string;
  page_title: string;
  page_navigation_order?: string;
  page_icon?: string;
  page_uuid?: string;
  page_entities?: string;
}
export interface IBodyUser {
  nick_name: string;
  email: string;
  password: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  user_uuid?: string;
}
export interface IBodyPageUuid {
  page_uuid: string;
}
export interface IEditPageBackground {
  page_uuid: string;
  background_url: string;
}
interface IEntityUuidAndOrder {
  entity_uuid: string;
  entity_order: number;
  entity_type: 'divider' | 'paragraph' | 'image' | 'table';
}
export interface IChangeEntitiesOrder {
  event: 'changeEntitiesOrder';
  body: {
    main: IEntityUuidAndOrder;
    target: IEntityUuidAndOrder;
  };
}
