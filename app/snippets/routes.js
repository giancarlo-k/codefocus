import { Router } from "express";
import { deleteSnippet, createSnippet, loadSnippets, favoriteSnippet, editSnippet, saveCode } from "./controller.js";
export const routes = new Router();

routes.get('/snippets', loadSnippets)
routes.post('/testurl', createSnippet)
routes.delete('/delete', deleteSnippet)
routes.put('/favorite', favoriteSnippet)
routes.put('/edit', editSnippet)
routes.put('/savecode', saveCode)