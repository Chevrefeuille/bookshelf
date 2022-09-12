import Airtable from "airtable";
import type { Book } from "@/types/Book";

const base = new Airtable({
  apiKey: import.meta.env.VITE_AIRTABLE_API_KEY,
}).base(import.meta.env.VITE_AIRTABLE_BASE);

const fetchOrCreate = (
  tableName: string,
  filteringFieldName: string,
  newRecords: any
): Promise<string> => {
  return new Promise((resolve, reject) => {
    base(tableName)
      .select({
        filterByFormula: `${filteringFieldName} = "${newRecords[0].fields[filteringFieldName]}"`,
      })
      .firstPage((err, records: any) => {
        if (err) {
          console.error(err);
          return reject(err);
        }
        if (!records?.length) {
          // create a record
          base(tableName).create(newRecords, (err: any, createRecords: any) => {
            if (err) {
              console.error(err);
              return reject(err);
            }
            if (records?.length) {
              resolve(createRecords[0].getId());
            }
          });
        } else {
          // use existing id
          resolve(records[0].getId());
        }
      });
  });
};

export const addBookRecords = async (books: Book[]) => {
  for (const book of books) {
    const authorIds: string[] = [];
    for (const authorName of book.authors) {
      const authorId = await fetchOrCreate("Authors", "Name", [
        {
          fields: { Name: authorName },
        },
      ]);
      if (authorId && !authorIds.includes(authorId)) {
        authorIds.push(authorId);
      }
    }
    const records = [
      {
        fields: {
          Title: book.title,
          Authors: authorIds,
          // ISBN: book.isbn,
          // Tags: filteredTagIds,
          "Open Library's key": book.key,
          "Published year": book.year,
          Cover: [{ url: book.coverUrl }],
        },
      },
    ] as any;
    base("Books").create(records, (err: any) => {
      if (err) {
        console.error(err);
        return;
      }
    });
  }
};

export const listBooks = async (): Promise<Book[]> => {
  return new Promise((resolve, reject) => {
    base("Books")
      .select()
      .all()
      .then((records) => {
        const books: Book[] = [];
        for (const record of records as any) {
          books.push({
            key: record.fields["Open Library's key"] as string,
            title: record.fields["Title"],
            authors: record.fields["Author's name"],
            isbn: record.fields["ISBN"],
            year: record.fields["year"],
            tags: [],
            languages: [],
            editions: [],
            coverUrl: record.fields["Cover"][0]["url"],
          });
        }
        resolve(books);
      })
      .catch((err) => {
        return reject(err);
      });
  });
};
