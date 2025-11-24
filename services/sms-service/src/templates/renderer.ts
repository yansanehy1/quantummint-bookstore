export async function renderTemplate(templateId: string, locale: string, variables: Record<string, any>): Promise<string> {
    // Simple template engine for now
    if (templateId === "gift") {
        return `Hi ${variables.name}, you've received a book gift: "${variables.title}". ${variables.message}`;
    }

    return variables.message || "";
}
