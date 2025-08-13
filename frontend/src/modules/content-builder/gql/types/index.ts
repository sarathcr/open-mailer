export interface EmailTemplatesData {
  findAllEmailTemplates: {
    data: any[];
    total: number;
    page: number;
    pageSize: number;
  };
}

export interface EmailTemplateData {
  findAllEmailTemplate: {
    id: string;
    name: string;
    filePath: string;
    primaryImageUrl: string;
    primaryLinkUrl: string;
    primaryBg: string;
    secondaryImageUrl: string;
    secondaryLinkUrl: string;
    secondaryBg: string;
    footerContent: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
  };
}
