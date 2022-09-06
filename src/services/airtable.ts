import Airtable from "airtable";
import type { Book } from "@/types/Book";

const base = new Airtable({
  apiKey: import.meta.env.VITE_AIRTABLE_API_KEY,
}).base(import.meta.env.VITE_AIRTABLE_BASE);

const fetchOrCreate = (
  tableName: string,
  filteringFieldName: string,
  record: any
): Promise<string> => {
  return new Promise((resolve, reject) => {
    base(tableName)
      .select({
        filterByFormula: `${filteringFieldName} = "${record.fields[filteringFieldName]}"`,
      })
      .firstPage((err, records) => {
        if (err) {
          console.error(err);
          return reject({});
        }
        if (!records?.length) {
          // create a record
          base(tableName).create([record], (err, records) => {
            if (err) {
              console.error(err);
              return reject({});
            }
            if (records?.length) {
              resolve(records[0].getId());
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
      const authorId = await fetchOrCreate("Authors", "Name", {
        fields: { Name: authorName },
      });
      if (authorId) {
        authorIds.push(authorId);
      }
    }
    const record = {
      fields: {
        Title: book.title,
        Authors: authorIds,
        // ISBN: book.isbn,
        // Tags: filteredTagIds,
        "Open Library's key": book.key,
        Cover: [{ url: book.coverUrl }],
      },
    };
    base("Books").create([record], (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
  }
};
