import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_ACCESS_TOKEN });

const handler = async (req) => {
    const { id, action } = await req.json();

    try {
        const page = await notion.pages.retrieve({ page_id: id });
        const currentLikes = page.properties["숫자"]?.number || 0;

        let newLikes;
        if (action === 'like') {
            newLikes = currentLikes + 1;
        } else if (action === 'unlike') {
            newLikes = Math.max(currentLikes - 1, 0);
        }

        await notion.pages.update({
            page_id: id,
            properties: {
                "숫자": {
                    number: newLikes,
                },
            },
        });

        return new Response(JSON.stringify({ likes: newLikes }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Failed to update likes' }), { status: 500 });
    }
};

export const POST = async (req) => {
    const response = await handler(req);

    response.headers.set('Access-Control-Allow-Origin', 'https://numi8462.github.io');
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    response.headers.set('Access-Control-Allow-Credentials', 'true'); 

    return response;
};

export const OPTIONS = () => {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': 'https://numi8462.github.io',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Credentials': 'true',
        },
    });
};

export const GET = async (req) => { 
    const response = await getHandler(req); 
    response.headers.set('Access-Control-Allow-Origin', 'https://numi8462.github.io'); 
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS'); 
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type'); 
    response.headers.set('Access-Control-Allow-Credentials', 'true'); 
};
