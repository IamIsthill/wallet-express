import { Router } from "express";
import * as controller from "../controllers/accounts";

const router = Router()

router.post('/', controller.addAccount)