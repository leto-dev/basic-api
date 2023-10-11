import http from 'node:http'
import { json } from './middlewares/json.js'
import { routes } from './routes.js'
import { extractQueryParams } from './utils/extract-query-params.js'

//UUID => Unique Universal ID
//GET => Buscar um recurso do back-end
//POST => Criar um recurso do back-end
//PUT => Atualiar um recurso do back-end
//PATCH => Atualizar uma informação específica de um recurso no back-end
//DELETE => Deletar um recurso do back-end

//Stateful - Stateless

//Cabeçalhos (Requisição/resposta) => Metadados

//HTTP Status Code

// -> Formas do front-end enviar requisições para o back-end
// Query Parameters: Stateful -> Filtros, paginação, não-obrigatórios
// Route Parameters: Identificação de recurso
// Request Body: Envio de informações de um formulário

const server = http.createServer(async (req, res) => {
    const { method, url } = req

    await json(req, res)
        
    const route = routes.find(route => {
        return route.method == method && route.path.test(url)
    })

    if (route) {
        const routeParams = req.url.match(route.path)

        //console.log(extractQueryParams(routeParams.groups.query))

        const { query, ...params } = routeParams.groups

        req.params = params
        req.query = query ? extractQueryParams(query) : {}

        return route.handler(req, res)
    }
    
    return res.writeHead(404).end('Not found')
})


server.listen(3333)
