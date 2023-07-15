import { useEffect, useState } from "react";
import styled from "styled-components";

interface Book {
  title: string;
  cover_i?: number;
  author_name?: string[];
  first_publish_year?: number;
  id_amazon?: string[];
}

export default function Home() {
  const [book, setBook] = useState<string>("");
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [apiPage, setApiPage] = useState<number>(1);

  const fetchData = async (pageNum: number) => {
    const bookQuery = book.replace(/\s/g, "+");
    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?q=${bookQuery}&page=${pageNum}`
      );
      const libros = await res.json();
      setTotalPages(Math.ceil(libros.numFound / 16));
      return libros.docs;
    } catch (e) {
      console.log("Error en el fetch.");
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchData(1).then((data) => {
      setBooks(data);
    });
    setApiPage(2);
  };

  useEffect(() => {
    if (page * 16 > books.length) {
      fetchData(apiPage).then((data) => {
        setBooks((prevBooks) => [...prevBooks, ...data]);
      });
      setApiPage(apiPage + 1);
    }
  }, [page]);

  return (
    <>
      <h1>Libreria REST</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={book}
          onChange={(e) => {
            setBook(e.target.value);
          }}
        />
        <button>Buscar</button>
      </form>
      {page > 1 && (
        <button onClick={() => setPage(page - 1)}>Anterior página</button>
      )}
      {page < totalPages && (
        <button onClick={() => setPage(page + 1)}>Siguiente página</button>
      )}

      <Container>
        {books.slice((page - 1) * 16, page * 16).map((book, index) => (
          <StyledBook key={index}>
            <StyledImage
              src={`http://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
              alt={book.title}
            />
            <p>{book.title}</p>
            <p>{book.author_name}</p>
            <p>{book.first_publish_year}</p>
            <p>
              {book.id_amazon && book.id_amazon[0] !== "" && (
                <a href={`https://www.amazon.es/dp/${book.id_amazon[0]}`}>
                  Amazon
                </a>
              )}
            </p>
          </StyledBook>
        ))}
      </Container>
    </>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
`;

const StyledBook = styled.div`
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
  max-width: 150px;
  max-height: 150px;
`;
