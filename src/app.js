const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid, v4, validate } = require("uuid");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const repoExistsMiddleware = (request, response, next) => {
  const { id } = request.params;

  const findRepositoryIndex = repositories.findIndex(
    repository => repository.id === id
  );

  if (findRepositoryIndex < 0)
    return response.status(400).json({ error: "Repository does not exists" });

  request.body.repositoryIndex = findRepositoryIndex;

  next();
};

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: v4(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", repoExistsMiddleware, (request, response) => {
  const { id } = request.params;
  const { title, url, techs, repositoryIndex } = request.body;

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes,
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", repoExistsMiddleware, (request, response) => {
  const { repositoryIndex } = request.body;

  repositories.splice(repositoryIndex, 1);

  return response.status(204).end();
});

app.post(
  "/repositories/:id/like",
  repoExistsMiddleware,
  (request, response) => {
    const { repositoryIndex } = request.body;

    repositories[repositoryIndex].likes++;

    return response.json(repositories[repositoryIndex]);
  }
);

module.exports = app;
