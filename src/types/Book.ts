export interface Book {
  key: string;
  title: string | undefined;
  authors: string[];
  isbn: string[];
  year: number | undefined;
  tags: string[];
  languages: string[];
  editions: string[];
  coverUrl: string;
}
