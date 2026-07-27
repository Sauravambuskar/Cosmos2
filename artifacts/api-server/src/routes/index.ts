import { Router, type IRouter } from "express";
import healthRouter from "./health";
import adminAuthRouter from "./admin/index";
import adminPropertiesRouter from "./admin/properties";
import adminContactsRouter from "./admin/contacts";
import adminProjectsRouter from "./admin/projects";
import publicPropertiesRouter from "./publicProperties";
import publicProjectsRouter from "./publicProjects";

const router: IRouter = Router();

router.use(healthRouter);
router.use(adminAuthRouter);
router.use(adminPropertiesRouter);
router.use(adminContactsRouter);
router.use(adminProjectsRouter);
router.use(publicPropertiesRouter);
router.use(publicProjectsRouter);

export default router;
