import { Router, type IRouter } from "express";
import healthRouter from "./health";
import adminAuthRouter from "./admin/index";
import adminPropertiesRouter from "./admin/properties";
import adminContactsRouter from "./admin/contacts";
import adminProjectsRouter from "./admin/projects";
import adminSettingsRouter from "./admin/settings";
import adminAccountRouter from "./admin/account";
import adminStatsRouter from "./admin/stats";
import publicPropertiesRouter from "./publicProperties";
import publicProjectsRouter from "./publicProjects";
import settingsRouter from "./settings";

const router: IRouter = Router();

router.use(healthRouter);
router.use(adminAuthRouter);
router.use(adminPropertiesRouter);
router.use(adminContactsRouter);
router.use(adminProjectsRouter);
router.use(adminSettingsRouter);
router.use(adminAccountRouter);
router.use(adminStatsRouter);
router.use(publicPropertiesRouter);
router.use(publicProjectsRouter);
router.use(settingsRouter);

export default router;
