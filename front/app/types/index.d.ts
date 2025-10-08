export type Mask =
  | "email"
  | "cpf"
  | "datetime"
  | "numeric"
  | "currency"
  | "decimal"
  | "integer"
  | (string & {})
  | (string[] & {})
  | null;

export type PageProps = {
  params: { [x: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export type AsyncPageProps = {
  params: Promise<{ [x: string]: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};
