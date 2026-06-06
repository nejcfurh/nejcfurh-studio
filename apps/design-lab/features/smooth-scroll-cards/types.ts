export interface CardDataType {
  name: string;
  description: string;
  tags: { name: string; color: string }[];
  image: string;
  source_code_link: string;
  link: string;
  has_preview?: boolean;
}
