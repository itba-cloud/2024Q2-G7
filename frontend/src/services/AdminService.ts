import { APPLICATION_JSON_TYPE, paths } from "../common";
import { AgentModel, ExperienceModel, Result } from "../types";
import { resultFetch } from "../scripts/resultFetch";

export class AdminService {
    private readonly adminBasePath = paths.API_URL + paths.ADMIN;

    //TODO hacer paginado?

    public async getPendingExperiences(): Promise<Result<ExperienceModel[]>> {
        const url = new URL(this.adminBasePath + '/experiences');
        return resultFetch<ExperienceModel[]>(url.toString(), {
            method: "GET"
        })
    }

    public async getPendingExperienceById(
        experienceId: string,
    ): Promise<Result<ExperienceModel>> {
        const url = new URL(this.adminBasePath + `/experiences/${experienceId}`);
        return resultFetch<ExperienceModel>(url.toString(), {
            method: "GET"
        })
    }

    public async approveExperience(
        experienceId: string,
        approve: boolean
    ) {
        const url = new URL(this.adminBasePath + `/experiences/${experienceId}`);
        const approveBody = JSON.stringify({
            approve: approve
        });

        return resultFetch(url.toString(), {
            method: "PUT",
            headers: {
                "Content-Type": APPLICATION_JSON_TYPE,
            },
            body: approveBody,
        });
    }

    public async getPendingAgents(): Promise<Result<AgentModel[]>> {
        const url = new URL(this.adminBasePath + '/agents');
        return resultFetch<AgentModel[]>(url.toString(), {
            method: "GET"
        })
    }

    public async getPendingAgentById(
        agentId: string,
    ): Promise<Result<AgentModel>> {
        const url = new URL(this.adminBasePath + `/agents/${agentId}`);
        return resultFetch<AgentModel>(url.toString(), {
            method: "GET"
        })
    }

    public async approveAgent(
        agentId: string,
        approve: boolean
    ) {
        const url = new URL(this.adminBasePath + `/agents/${agentId}`);
        const approveBody = JSON.stringify({
            approve: approve
        });

        return resultFetch(url.toString(), {
            method: "PUT",
            headers: {
                "Content-Type": APPLICATION_JSON_TYPE,
            },
            body: approveBody,
        });
    }
}