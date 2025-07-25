CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  due_date TIMESTAMP,
  reminder TIMESTAMP,
  trashed BOOLEAN DEFAULT FALSE
);

-- Mark todo as trashed
-- UPDATE todos SET trashed = TRUE WHERE id = ?;
-- Restore todo from trash
-- UPDATE todos SET trashed = FALSE WHERE id = ?;
