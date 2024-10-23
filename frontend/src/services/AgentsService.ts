import { APPLICATION_JSON_TYPE, paths } from "../common";
import { AgentModel, ArticleModel, PagedContent, PostResponse, PutResponse, Result } from "../types";
import { resultFetch } from "../scripts/resultFetch";
import { getPagedFetch } from "../scripts/getPagedFetch";

export class AgentsService {

    private readonly agentsBasePath = paths.API_URL + paths.AGENTS;

    public async createAgent(
        name: string,
        email: string,
        phone: string,
        address: string,
        languages: string,
        experience: number,
        bio: string,
        agency?: string,
        specialization?: string,
        twitter?: string,
        instagram?: string,
    ): Promise<Result<PostResponse>> {
        const newAgent = JSON.stringify({
            name: name,
            email: email,
            phone: phone,
            address: address,
            languages: languages,
            experience: experience,
            bio: bio,
            agency: agency ? agency : "",
            specialization: specialization ? specialization : "",
            twitter: twitter ? twitter : "",
            instagram: instagram ? instagram : "",
        });

        return resultFetch<PostResponse>(this.agentsBasePath, {
            method: "POST",
            headers: {
                "Content-Type": APPLICATION_JSON_TYPE,
            },
            body: newAgent,
        });
    }

    public async getAgents(
        page?: number
    ): Promise<Result<PagedContent<AgentModel[]>>> {
        const url = new URL(this.agentsBasePath);
        return getPagedFetch<AgentModel[]>(url.toString(), page);
    }

    public async getAgentById(
        agentId: string,
    ): Promise<Result<AgentModel>> {
        const url = new URL(this.agentsBasePath + `/${agentId}`);
        return resultFetch<AgentModel>(url.toString(), {
            method: "GET"
        })
    }

    public async updateAgentById(
        agentId: string,
        name: string,
        email: string,
        phone: string,
        address: string,
        languages: string,
        experience: number,
        bio: string,
        agency?: string,
        specialization?: string,
        twitter?: string,
        instagram?: string,
    ): Promise<Result<PutResponse>> {
        const agentToUpdate = JSON.stringify({
            name: name,
            email: email,
            phone: phone,
            address: address,
            languages: languages,
            experience: experience,
            bio: bio,
            agency: agency ? agency : "",
            specialization: specialization ? specialization : "",
            twitter: twitter ? twitter : "",
            instagram: instagram ? instagram : "",
        });
        return resultFetch(this.agentsBasePath + `/${agentId}`, {
            method: "PUT",
            headers: {
                "Content-Type": APPLICATION_JSON_TYPE,
            },
            body: agentToUpdate,
        });
    }

    public async updateAgentImage(
        agentId: string,
        file: File
    ): Promise<Result<PutResponse>> {
        const reader = new FileReader();
    
        return new Promise((resolve, reject) => {
            reader.onloadend = async () => {
                const base64data = reader.result; 
                const contentType = file.type;
    
                try {
                    const response = await resultFetch<PutResponse>(this.agentsBasePath + `/${agentId}/image`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": APPLICATION_JSON_TYPE,
                        },
                        body: JSON.stringify({
                            image: base64data, 
                            content_type: contentType, 
                        }),
                    });
    
                    resolve(response);
                } catch (error) {
                    reject(error);
                }
            };
    
            reader.onerror = (error) => {
                reject(error);
            };
    
            reader.readAsDataURL(file);
        });
    }

    public async createArticle(
        title: string,
        description: string,
        agentId: string,
    ): Promise<Result<PostResponse>> {
        const newArticle = JSON.stringify({
            title: title,
            description: description,
            agent_id: agentId,
        });

        return resultFetch<PostResponse>(this.agentsBasePath + `/${agentId}/articles`, {
            method: "POST",
            headers: {
                "Content-Type": APPLICATION_JSON_TYPE,
            },
            body: newArticle,
        });
    }

    public async getArticles(
        agentId: string,
        page?: number
    ): Promise<Result<ArticleModel[]>> {
        const url = new URL(this.agentsBasePath + `/${agentId}/articles`);
        return resultFetch<ArticleModel[]>(url.toString(), {method: "GET",});
    }

}