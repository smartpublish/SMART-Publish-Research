export interface Comment {
    workflow: WorkflowState
    message: string,
    author: string,
    timestamp: number
}

export interface WorkflowState {
    name: string
    state: string 
}