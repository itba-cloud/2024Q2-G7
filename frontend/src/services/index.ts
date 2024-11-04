import { ExperienceService } from "./ExperienceService";
import { LocationService } from "./LocationService";
import { ReviewService } from "./ReviewService";
import { UserService } from "./UserService";
import { AdminService } from "./AdminService";
import { AgentsService } from "./AgentsService";

const experienceService = new ExperienceService();
const locationService = new LocationService();
const reviewService = new ReviewService();
const userService = new UserService();
const adminService = new AdminService();
const agentsService = new AgentsService();

export {
    experienceService,
    locationService,
    reviewService,
    userService,
    adminService,
    agentsService
};