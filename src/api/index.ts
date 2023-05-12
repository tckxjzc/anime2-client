import http from "@/api/http";

export async function getList(page: number, keyword: string) {
    const res = await http.get('/list', {
        params: {page, keyword},
    });
    return res.data;
}

export async function getDetail(id: string) {
    const res = await http.get('/detail', {
        params: {id},
    });
    return res.data;
}
