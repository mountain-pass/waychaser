import { assert, expect } from 'chai'
import { When, Then, DataTable } from '@cucumber/cucumber'
import logger from './logger'
import { binding, given, then, when } from 'cucumber-tsflow';
import { waychaser } from '../waychaser'
import {
    uniqueNamesGenerator,
    adjectives,
    colors,
    animals
} from 'unique-names-generator'
import { startServer, app, stopServer, getNewRouter } from './fakes/server'
import { API_PORT, API_HOST } from './config'
import { WayChaserProblem, WayChaserResponse } from '../waychaser-response';
import nodeFetch from 'cross-fetch'
import LinkHeader from 'http-link-header'
import aws4 from 'aws4'
import MediaTypes from '../util/media-types';
import { Operation } from '../operation';

let pathCount = 0

const CUSTOM_HEADER_MEDIA_TYPE = 'application/custom+json'
const CUSTOM_LINK_HEADER_MEDIA_TYPE = 'application/custom-link+json'
const CUSTOM_BODY_MEDIA_TYPE = 'application/custom-body+json'
const CUSTOM_LINKS_BODY_MEDIA_TYPE = 'application/custom-body-links+json'
const LOCATION_LINK_MEDIA_TYPE = 'application/location+json'

export const randomApiPath = () => {
    return `/api/${pathCount++}-${uniqueNamesGenerator({
        dictionaries: [adjectives, colors, animals]
    })}`
}

function expectIsWayChaserResponse<Content>(response: WayChaserProblem<Response> | WayChaserProblem<never> | WayChaserResponse<Content> | undefined,
    typePredicate?: (response: unknown) => response is WayChaserResponse<Content>): asserts response is WayChaserResponse<Content> {
    if (response instanceof WayChaserProblem) {
        console.error(response)
    }
    expect(response).to.be.instanceOf(WayChaserResponse);
    if (response && typePredicate) {
        expect(typePredicate(response)).to.be.true
    }
}

function filterParameters(parameters, type): string[] {
    return parameters?.filter(parameter_ => {
        return parameter_.TYPE === type
    }).map(parameter_ => parameter_.NAME)
}

function awsFetch(url, options?) {
    const parsedUrl = new URL(url)
    const signedOptions = aws4.sign(
        Object.assign(
            {
                host: parsedUrl.host,
                path: `${parsedUrl.pathname}?${parsedUrl.searchParams}`,
                method: 'GET'
            },
            options
        )
    )
    logger.debug({ signedOptions })
    return nodeFetch(url, signedOptions)
}

@binding()
export class OperationSteps {
    private waychaser = waychaser.defaults({ fetch: nodeFetch })
    currentPath: string;
    router = getNewRouter()
    baseUrl = `http://${API_HOST}:${API_PORT}`
    response: WayChaserProblem<Response> | WayChaserProblem<never> | WayChaserResponse<unknown> | undefined;
    expectedOperations: any[];
    previousPath: string;
    lastPath: string;
    expectedResponseContent: Record<string, string>;
    currentFragment: unknown[];
    awsSchema: any;
    previousResponse: WayChaserProblem<Response> | WayChaserProblem<never> | WayChaserResponse<unknown> | undefined;
    items: (WayChaserProblem<Response> | WayChaserProblem<never> | WayChaserResponse<unknown>)[] | undefined;

    @given('an endpoint returning status code {int}')
    public endpoint(status) {
        this.currentPath = randomApiPath()
        this.router.get(this.currentPath, async (request, response) => {
            response.status(status).json({
                status
            })
        })
    }

    @given('an endpoint returning')
    public async anEndpointReturning(documentString: string) {
        this.previousPath = this.currentPath
        this.currentPath = randomApiPath()
        this.router.get(this.currentPath, async (request, response) => {
            response.json(JSON.parse(documentString))
        })
    };

    @given('an endpoint at {string}')
    public anEndpointAt(path: string) {
        this.currentPath = path
        this.router.get(this.currentPath, async (request, response) => {
            response.json({})
        })
    };

    @given('an endpoint with a {string} operation')
    public anEndpointWithAsOperation(relationship) {
        this.currentPath = randomApiPath()
        this.router.get(this.currentPath, async (request, response) => {
            const links = new LinkHeader()
            links.set({
                rel: relationship,
                uri: this.currentPath
            })
            response.header('link', links.toString())
            response.json({})
        })
    };

    @given('an endpoint with a {string} operation with the URI {string}')
    public async anEndpointWithAOperationWithTheURI(relationship: string, path: string) {
        this.currentPath = randomApiPath()
        this.router.get(this.currentPath, async (request, response) => {
            const links = new LinkHeader()
            links.set({
                rel: relationship,
                uri: path
            })
            response.header('link', links.toString())
            response.json({})
        })
    };

    @given('an endpoint with a {string} operation with the URI {string} returning')
    public async anEndpointWithAsOperationWithTheURIsReturning(relationship: string, path: string, stringBody: string) {
        this.currentPath = randomApiPath()
        this.router.get(this.currentPath, async (request, response) => {
            const links = new LinkHeader()
            links.set({
                rel: relationship,
                uri: path
            })
            response.header('link', links.toString())
            response.json(JSON.parse(stringBody))
        })
    };

    @given('an endpoint with the operations')
    public async anEndpointWithTheOperations(dataTable: DataTable) {
        this.currentPath = randomApiPath()
        this.router.get(this.currentPath, async (request, response) => {
            const links = new LinkHeader()
            for (const row of dataTable.hashes()) {
                links.set(row)
            }
            response.header('link', links.toString())
            response.json({})
        })
    };

    @given('an endpoint returning {string} with the following links')
    public async anEndpointReturningWithTheFollowingLinks(content: string, dataTable: DataTable) {
        this.previousPath = this.currentPath
        this.currentPath = randomApiPath()
        this.router.get(this.currentPath, async (request, response) => {
            const links = new LinkHeader()
            for (const row of dataTable.hashes()) {
                links.set(row)
            }
            response.header('link', links.toString())
            response.json(JSON.parse(content))
        })
    };


    @given('an endpoint with the body {string} and the links')
    public async anEndpointWithTheBodyAndTheLinks(body: string, dataTable: DataTable) {
        this.previousPath = this.currentPath
        this.currentPath = randomApiPath()
        this.router.get(this.currentPath, async (request, response) => {
            const links = new LinkHeader()
            for (const row of dataTable.hashes()) {
                links.set(row)
            }
            response.header('link', links.toString())
            response.json(JSON.parse(body))
        })
    };

    @given('an endpoint with no body and the links')
    public async anEndpointWithNoBodyAndTheLinks(dataTable: DataTable) {
        this.previousPath = this.currentPath
        this.currentPath = randomApiPath()
        this.router.get(this.currentPath, async (request, response) => {
            const links = new LinkHeader()
            for (const row of dataTable.hashes()) {
                links.set(row)
            }
            response.header('link', links.toString())
            response.end()
        })
    };

    @given('an endpoint that\'s a collection with {int} items')
    public async anEndpointThatsACollectionWithsItems(count: number) {

        const body = [...Array.from({ length: count }).keys()].map(
            index => ({
                id: index,
                title: 'foo',
                other: 'bar'
            })
        )

        this.currentPath = randomApiPath()
        this.router.get(this.currentPath, async (request, response) => {
            const links = new LinkHeader()
            links.set({ rel: 'item', uri: `#/{[0..${count - 1}]}` })
            links.set({
                rel: 'canonical',
                uri: './{this.id}',
                anchor: `#/{[0..${count - 1}]}`
            })
            response.header('link', links.toString())
            response.json(body)
        })

    };


    @given('an endpoint with a {string} operation that returns itself')
    public anEndpointWithAsOperationThatReturnsItself(relationship) {
        this.anEndpointWithAsOperation(relationship)
    };

    @given('an endpoint with a {string} operation that returns an error')
    public anEndpointWithAsOperationThatReturnsAnError(relationship) {
        const errorPath = randomApiPath()
        this.router.get(errorPath, async (request, response) => {
            response.status(500).json({})
        })

        this.currentPath = randomApiPath()
        this.router.get(this.currentPath, async (request, response) => {
            const links = new LinkHeader()
            links.set({
                rel: relationship,
                uri: errorPath
            })
            response.header('link', links.toString())
            response.json({})
        })
    };

    @given('a HAL endpoint with a {string} operation that returns an error')
    public async aHALEndpointWithAsOperationThatReturnsAnError(relationship: string) {
        const errorPath = randomApiPath()
        this.router.get(errorPath, async (request, response) => {
            response.status(500).json({})
        })

        this.currentPath = randomApiPath()
        this.router.get(this.currentPath, async (request, response) => {
            const bodyOperations = {
                '_links': {
                    [relationship]: { href: errorPath }
                }
            }
            response.header('content-type', MediaTypes.HAL)
            response.json(Object.assign({}, bodyOperations))
        })
    };

    @given('a Siren endpoint with a {string} operation that returns an error')
    public async aSirenEndpointWithAsOperationThatReturnsAnError(relationship: string) {
        const errorPath = randomApiPath()
        this.router.get(errorPath, async (request, response) => {
            response.status(500).json({})
        })

        this.currentPath = randomApiPath()
        this.router.get(this.currentPath, async (request, response) => {
            const bodyOperations = createSirenLink(relationship, errorPath)
            response.header('content-type', MediaTypes.SIREN)
            response.json(Object.assign({}, bodyOperations))
        })
    };

    @given('an endpoint with no operations')
    public anEndpointWithNoOperations() {
        this.endpoint(200)
    };

    @given('an endpoint with a {string} operation that returns that previous endpoint')
    public anEndpointWithAsOperationThatReturnsThatPreviousEndpoint(relationship) {
        const previousPath = this.currentPath
        this.previousPath = previousPath
        this.currentPath = randomApiPath()
        this.router.get(this.currentPath, async (request, response) => {
            const links = new LinkHeader()
            links.set({
                rel: relationship,
                uri: previousPath
            })
            response.header('link', links.toString())
            response.json({})
            console.log({ url: request.url, links: links.toString() })
        })
    };

    @given('a list of {int} endpoints linked with {string} operations')
    public aListOfsResourcesLinkedWithOperations(count, relationship) {
        // we add the last one first
        this.lastPath = randomApiPath()
        console.log({ last: this.lastPath })
        this.currentPath = this.lastPath
        this.router.get(this.currentPath, async (request, response) => {
            response.json({})
        })
        for (let index = 1; index < count; index++) {
            this.anEndpointWithAsOperationThatReturnsThatPreviousEndpoint(relationship)
            console.log({ current: this.currentPath })
        }
        // POST: this.currentPath points to the first resource in the list
    };

    @given('a list of {int} HAL endpoints linked with {string} operations')
    public async aListOfsHALEndpointsLinkedWithsOperations(count: number, relationship: string) {
        // we add the last one first
        this.lastPath = randomApiPath()
        console.log({ last: this.lastPath })
        this.currentPath = this.lastPath
        this.router.get(this.currentPath, async (request, response) => {
            response.json({})
        })
        for (let index = 1; index < count; index++) {
            this.aHALEndpointWithAsOperationThatReturnsThatEndpoint(relationship)
            console.log({ current: this.currentPath })
        }
        // POST: this.currentPath points to the first resource in the list
    };

    @given('a list of {int} Siren endpoints linked with {string} operations')
    public async aListOfsSirenEndpointsLinkedWithsOperations(count: number, relationship: string) {
        // we add the last one first
        this.lastPath = randomApiPath()
        console.log({ last: this.lastPath })
        this.currentPath = this.lastPath
        this.router.get(this.currentPath, async (request, response) => {
            response.json({})
        })
        for (let index = 1; index < count; index++) {
            this.aSirenEndpointWithAsOperationThatReturnsThatEndpoint(relationship)
            console.log({ current: this.currentPath })
        }
        // POST: this.currentPath points to the first resource in the list
    };

    @given('an endpoint with a {string} operation that returns the provided {string} {string} parameter')
    public anEndpointWithAsOperationThatReturnsTheProvidedParameter(relationship: string, parameterName: string, parameterType: string) {
        const operationPath = randomApiPath()
        this.router.get(operationPath + (parameterType === 'path' ? `/:${parameterName}` : ``), async (request, response) => {
            response.json({ [parameterName]: request[parameterType === 'query' ? 'query' : 'params'][parameterName] })
        })

        this.currentPath = randomApiPath()
        this.router.get(this.currentPath, async (request, response) => {
            const links = new LinkHeader()
            links.set({
                rel: relationship,
                uri: operationPath + (parameterType === 'path' ? `{/${parameterName}}` : `{?${parameterName}}`)
            })
            response.header('link', links.toString())
            response.json({})
        })
    };

    @given('a HAL endpoint with a {string} operation that returns the provided {string} {string} parameter')
    public async aHALEndpointWithAsOperationThatReturnsTheProvidedsParameter(relationship: string, parameterName: string, parameterType: string) {
        const operationPath = randomApiPath()
        this.router.get(operationPath + (parameterType === 'path' ? `/:${parameterName}` : ``), async (request, response) => {
            response.json({ [parameterName]: request[parameterType === 'query' ? 'query' : 'params'][parameterName] })
        })

        this.currentPath = randomApiPath()
        this.router.get(this.currentPath, async (request, response) => {
            const bodyOperations = {
                _links: {
                    [relationship]: { href: operationPath + (parameterType === 'path' ? `{/${parameterName}}` : `{?${parameterName}}`) }
                }
            }
            response.header('content-type', MediaTypes.HAL)
            response.json(bodyOperations)
        })
    };

    @given('an endpoint with a {string} operation with the URI {string} and the body')
    public anEndpointWithAOperationWithTheURIAndTheBody(relationship: string, operationPath: string, documentString: string) {
        this.previousPath = this.currentPath
        this.currentPath = randomApiPath()
        this.router.get(this.currentPath, async (request, response) => {
            const links = new LinkHeader()
            links.set({
                rel: relationship,
                uri: operationPath
            })
            response.header('link', links.toString())
            response.json(JSON.parse(documentString))
        })
    };

    @given('an endpoint with a {string} operation that returns the provided {string} header')
    public anEndpointWithAsOperationThatReturnsTheProvidedsHeader(relationship: string, headerName: string) {
        const operationPath = randomApiPath()
        this.router.get(operationPath, async (request, response) => {
            response.json({
                [headerName]: request.headers[headerName]
            })
        })

        this.currentPath = randomApiPath()
        this.router.get(this.currentPath, async (request, response) => {
            const links = new LinkHeader()
            links.set({
                rel: relationship,
                uri: operationPath
            })
            response.header('link', links.toString())
            response.json({})
        })
    };

    @given('an endpoint with a {string} operation with the {string} method that returns the provided {string} {string} parameter')
    public anEndpointWithAsOperationWithTheMethodThatReturnsTheProvidedParameter(relationship: string, method: string, parameterName: string, parameterType: string) {
        const operationPath = randomApiPath()
        this.router[method.toLowerCase()](operationPath + (parameterType === 'path' ? `/:${parameterName}` : ``), async (request, response) => {
            response.json({ ...request.query || {}, ...request.body || {}, ...request.params || {} })
        })

        this.currentPath = randomApiPath()
        this.router.get(this.currentPath, async (request, response) => {
            const links = new LinkHeader()
            let uri = operationPath;
            if (parameterType === 'path') {
                uri += `{/${parameterName}}`
            }
            else if (parameterType === 'query') {
                uri += `{?${parameterName}}`
            }
            links.set({
                rel: relationship,
                uri: operationPath + (parameterType === 'path' ? `{/${parameterName}}` : `{?${parameterName}}`),
                method,
                ...(parameterType === 'body' && { 'params*': { value: JSON.stringify([parameterName]) } })
            })
            response.header('link', links.toString())
            response.json({})
        })
    };

    @given('an endpoint with a {string} operation with the {string} method that returns the following provided parameters')
    public anEndpointWithAsOperationWithTheMethodThatReturnsTheFollowingProvidedParameters(relationship: string, method: string, dataTable: DataTable) {
        const operationPath = randomApiPath()
        const parameters = dataTable.hashes() as { NAME: string, TYPE: string }[]
        const queryParameters = filterParameters(parameters, 'query')
        const bodyParameters = filterParameters(parameters, 'body')
        const pathParameters = filterParameters(parameters, 'path')
        const routerUri = [operationPath, ...pathParameters].join('/:')
        this.router[method.toLowerCase()](routerUri, async (request, response) => {
            response.json({ ...request.query || {}, ...request.body || {}, ...request.params || {} })
        })

        this.currentPath = randomApiPath()
        this.router.get(this.currentPath, async (request, response) => {
            const links = new LinkHeader()
            let uri = operationPath;
            if (pathParameters.length !== 0) {
                uri += `{/${pathParameters.join(',')}}`
            }
            if (queryParameters.length !== 0) {
                uri += `{?${queryParameters.join(',')}}`
            }
            links.set({
                rel: relationship,
                uri,
                method,
                ...(bodyParameters.length !== 0 && { 'params*': { value: JSON.stringify(bodyParameters) } })
            })
            response.header('link', links.toString())
            response.json({})
        })
    };

    @given('a HAL endpoint with a {string} operation with the {string} method that returns the following provided parameters')
    public async aHALEndpointWithAsOperationWithTheMethodThatReturnsTheFollowingProvidedParameters(relationship: string, method: string, dataTable: DataTable) {
        const operationPath = randomApiPath()
        const parameters = dataTable.hashes() as { NAME: string, TYPE: string }[]
        const queryParameters = filterParameters(parameters, 'query')
        const pathParameters = filterParameters(parameters, 'path')
        const routerUri = [operationPath, ...pathParameters].join('/:')
        this.router[method.toLowerCase()](routerUri, async (request, response) => {
            response.json({ ...request.query || {}, ...request.params || {} })
        })

        this.currentPath = randomApiPath()
        this.router.get(this.currentPath, async (request, response) => {
            let uri = operationPath;
            if (pathParameters.length !== 0) {
                uri += `{/${pathParameters.join(',')}}`
            }
            if (queryParameters.length !== 0) {
                uri += `{?${queryParameters.join(',')}}`
            }
            const bodyOperations = {
                _links: {
                    [relationship]: { href: uri }
                }
            }
            response.header('content-type', MediaTypes.HAL)
            response.json(bodyOperations)

        })
    };

    @given('an endpoint with a {string} operation with the {string} method that returns the following {string} provided parameters and the content type')
    public anEndpointWithAsOperationWithTheMethodThatReturnsTheFollowingsProvidedParametersAndTheContentType(relationship: string, method: string, contentType: string, dataTable: DataTable) {
        const operationPath = randomApiPath()
        const parameters = dataTable.hashes() as { NAME: string, TYPE: string }[]
        const queryParameters = filterParameters(parameters, 'query')
        const bodyParameters = filterParameters(parameters, 'body')
        const pathParameters = filterParameters(parameters, 'path')
        const routerUri = [operationPath, ...pathParameters].join('/:')
        this.router[method.toLowerCase()](routerUri, async (request, response) => {
            response.json({ 'content-type': contentType, ...request.query || {}, ...request.body || {}, ...request.params || {} })
        })

        this.currentPath = randomApiPath()
        this.router.get(this.currentPath, async (request, response) => {
            const links = new LinkHeader()
            let uri = operationPath;
            if (pathParameters.length !== 0) {
                uri += `{/${pathParameters.join(',')}}`
            }
            if (queryParameters.length !== 0) {
                uri += `{?${queryParameters.join(',')}}`
            }
            links.set({
                rel: relationship,
                uri,
                method,
                ...(bodyParameters.length !== 0 && { 'params*': { value: JSON.stringify(bodyParameters) } })
            })
            response.header('link', links.toString())
            response.json({})
        })
    };

    @given('a Siren endpoint with a {string} operation with the {string} method that returns the following {string} provided parameters and the content type')
    public async aSirenEndpointWithAsOperationWithThesMethodThatReturnsTheFollowingsProvidedParametersAndTheContentType(relationship: string, method: string, contentType: string, dataTable: DataTable) {
        const operationPath = randomApiPath()
        const parameters = dataTable.hashes() as { NAME: string, TYPE: string }[]
        const queryParameters = filterParameters(parameters, 'query')
        const bodyParameters = filterParameters(parameters, 'body')
        const pathParameters = filterParameters(parameters, 'path')
        const routerUri = [operationPath, ...pathParameters].join('/:')
        this.router[method.toLowerCase()](routerUri, async (request, response) => {
            response.json({ 'content-type': contentType, ...request.query || {}, ...request.body || {}, ...request.params || {} })
        })

        this.currentPath = randomApiPath()
        this.router.get(this.currentPath, async (request, response) => {
            let uri = operationPath;
            if (pathParameters.length !== 0) {
                uri += `{/${pathParameters.join(',')}}`
            }
            if (queryParameters.length !== 0) {
                uri += `{?${queryParameters.join(',')}}`
            }
            const sirenBodyParameters = bodyParameters.map(key => {
                return { name: key }
            })
            const bodyOperations = {
                actions: [{
                    name: relationship,
                    href: uri,
                    method: method,
                    type: contentType,
                    fields: sirenBodyParameters
                }]
            }
            response.header('content-type', MediaTypes.SIREN)
            response.json(bodyOperations)
        })
    };

    @given('an endpoint with a {string} operation with the {string} method that returns the provided {string} {string} parameter and the content type, accepting:')
    public anEndpointWithAsOperationWithTheMethodThatReturnsTheProvidedsParameterAndTheContentTypeAccepting(relationship: string, method: string, parameterName: string, parameterType: string, dataTable: DataTable) {
        const operationPath = randomApiPath()
        this.router[method.toLowerCase()](operationPath, async (request, response) => {
            response.json({ 'content-type': request.header('content-type').split(';')[0], ...request.body })
        })

        this.currentPath = randomApiPath()
        this.router.get(this.currentPath, async (request, response) => {
            const links = new LinkHeader()
            links.set({
                rel: relationship,
                uri: operationPath,
                method,
                'accept*': { value: dataTable.rows().map(row => row[0]).join(',') },
                'params*': { value: JSON.stringify([parameterName]) },
            })
            response.header('link', links.toString())
            response.json({})
        })
    };

    @given('an endpoint with a {string} operation with the {string} method returning status code {int}')
    public anEndpointWithAsOperationWithTheMethodReturningStatusCodes(relationship: string, method: string, statusCode: number) {
        const operationPath = randomApiPath()
        this.router[method.toLowerCase()](operationPath, async (request, response) => {
            response.status(statusCode).end()
        })

        this.currentPath = randomApiPath()
        this.router.get(this.currentPath, async (request, response) => {
            const links = new LinkHeader()
            links.set({
                rel: relationship,
                uri: operationPath,
                method
            })
            response.header('link', links.toString())
            response.json({})
        })
    };

    @given('an endpoint with a {string} operation with the {string} method returning a location to that resource')
    public anEndpointWithAsOperationWithTheMethodReturningALocationToThatResource(relationship: string, method: string) {
        const operationPath = randomApiPath()
        const otherPath = this.currentPath
        this.previousPath = otherPath
        this.router[method.toLowerCase()](operationPath, async (request, response) => {
            response.header('location', otherPath).end()
        })

        this.currentPath = randomApiPath()
        this.router.get(this.currentPath, async (request, response) => {
            const links = new LinkHeader()
            links.set({
                rel: relationship,
                uri: operationPath,
                method
            })
            response.header('link', links.toString())
            response.json({})
        })
    };

    @given('a custom endpoint with a {string} header operation that returns itself')
    public aCustomEndpointWithAsHeaderOperationThatReturnsItself(relationship: string) {
        this.currentPath = randomApiPath()
        const path = this.currentPath
        this.router.get(path, async (request, response) => {
            const links = new LinkHeader()
            links.set({
                rel: relationship,
                uri: path,
            })
            response.header('custom-link', JSON.stringify(links.refs))
            response.json({})
        })
    };

    @given('a custom endpoint with a {string} header operation that returns that endpoint')
    public aCustomEndpointWithAsHeaderOperationThatReturnsThatEndpoint(relationship: string) {
        const previousPath = this.currentPath
        this.previousPath = previousPath
        this.currentPath = randomApiPath()
        this.router.get(this.currentPath, async (request, response) => {
            const links = new LinkHeader()
            links.set({
                rel: relationship,
                uri: previousPath
            })
            response.header('custom-link', JSON.stringify(links.refs))
            response.json({})
        })
    };




    @given('waychaser has a custom header handler')
    public waychaserHasACustomHeaderHandler() {
        this.waychaser = this.waychaser.defaults({
            handlers: [{
                handler: (
                    baseResponse: Response,
                ) => {
                    const linkHeader = baseResponse.headers.get('custom-link')
                    if (linkHeader) {
                        const links = JSON.parse(linkHeader)
                        return links
                    }
                    return []
                },
                mediaRanges: ['*/*;q=0.8']
            }]
        })
    };

    @given('waychaser has a custom header handler for an array of media types')
    public waychaserHasACustomHeaderHandlerForAnArrayOfMediaTypes() {
        this.waychaser = this.waychaser.defaults({
            handlers: [{
                handler: (
                    baseResponse: Response,
                ) => {
                    const linkHeader = baseResponse.headers.get('custom-link')
                    if (linkHeader) {
                        const links = JSON.parse(linkHeader)
                        return links
                    }
                    return []
                },
                mediaRanges: ['application/json', '*/*;q=0.8']
            }]
        })
    };

    @given('waychaser has a custom stopping header link handler')
    public waychaserHasACustomStoppingHeaderLinkHandler() {
        this.waychaser = this.waychaser.defaults({
            handlers: [{
                handler: (
                    baseResponse: Response,
                    content: unknown,
                    stopper: () => void,
                ) => {
                    const linkHeader = baseResponse.headers.get('link')
                    if (linkHeader) {
                        const links = JSON.parse(linkHeader)
                        stopper()
                        return links
                    }
                    return []
                },
                mediaRanges: ['application/json', '*/*;q=0.8']
            }]
        })
    };

    @given('a custom endpoint returning the following with a {string} body link that returns itself')
    public aCustomEndpointReturningTheFollowingWithAsBodyLinkThatReturnsItself(relationship: string, body: string) {
        this.currentPath = randomApiPath()
        const path = this.currentPath
        this.router.get(path, async (request, response) => {
            const bodyOperations = {
                customLinks: {
                    [relationship]: { href: path }
                }
            }
            response.json(Object.assign(JSON.parse(body), bodyOperations))
        })
    };

    @given('a custom endpoint with a {string} header operation that returns an error')
    public aCustomEndpointWithAsHeaderOperationThatReturnsAnError(relationship: string) {
        const operationPath = randomApiPath()
        this.router.get(operationPath, async (request, response) => {
            response.status(500).json({})
        })

        this.currentPath = randomApiPath()
        const path = this.currentPath
        this.router.get(path, async (request, response) => {
            const links = new LinkHeader()
            links.set({
                rel: relationship,
                uri: operationPath,
            })
            response.header('custom-link', JSON.stringify(links.refs))
            response.json({})
        })
    };

    @given('a custom endpoint with a {string} body operation that returns an error')
    public aCustomEndpointWithAsBodyOperationThatReturnsAnError(relationship: string) {
        const operationPath = randomApiPath()
        this.router.get(operationPath, async (request, response) => {
            response.status(500).json({})
        })

        this.currentPath = randomApiPath()
        this.router.get(this.currentPath, async (request, response) => {
            const bodyOperations = {
                customLinks: {
                    [relationship]: { href: operationPath }
                }
            }
            response.json(bodyOperations)
        })
    };


    @given('a custom endpoint with a {string} body operation that returns that endpoint')
    public aCustomEndpointWithAsBodyOperationThatReturnsThatEndpoint(relationship: string) {
        const previousPath = this.currentPath
        this.previousPath = previousPath
        this.currentPath = randomApiPath()
        this.router.get(this.currentPath, async (request, response) => {
            const bodyOperations = {
                customLinks: {
                    [relationship]: { href: previousPath }
                }
            }
            response.json(bodyOperations)
        })
    };

    @given('a HAL endpoint with a {string} operation that returns that endpoint')
    public async aHALEndpointWithAsOperationThatReturnsThatEndpoint(relationship: string) {
        const previousPath = this.currentPath
        this.previousPath = previousPath
        this.currentPath = randomApiPath()
        this.router.get(this.currentPath, async (request, response) => {
            const bodyOperations = {
                _links: {
                    [relationship]: { href: previousPath }
                }
            }
            response.header('content-type', MediaTypes.HAL)
            response.json(bodyOperations)
        })
    };

    @given('a Siren endpoint with a {string} operation that returns that endpoint')
    public async aSirenEndpointWithAsOperationThatReturnsThatEndpoint(relationship: string) {
        const previousPath = this.currentPath
        this.previousPath = previousPath
        this.currentPath = randomApiPath()
        this.router.get(this.currentPath, async (request, response) => {
            const bodyOperations = createSirenLink(relationship, previousPath)
            response.header('content-type', MediaTypes.SIREN)
            response.json(bodyOperations)
        })
    };


    @given('a custom endpoint with a {string} body _links operation that returns that endpoint')
    public aCustomEndpointWithAsBody_linksOperationThatReturnsThatEndpoint(relationship: string) {
        const previousPath = this.currentPath
        this.previousPath = previousPath
        this.currentPath = randomApiPath()
        this.router.get(this.currentPath, async (request, response) => {
            const bodyOperations = {
                '_links': {
                    [relationship]: { href: previousPath }
                }
            }
            response.json(bodyOperations)
        })
    };

    @given('a custom endpoint with a {string} header link operation that returns that endpoint')
    public aCustomEndpointWithAsHeaderLinkOperationThatReturnsThatEndpoint(relationship: string) {
        const previousPath = this.currentPath
        this.previousPath = previousPath
        this.currentPath = randomApiPath()
        this.router.get(this.currentPath, async (request, response) => {
            const links = new LinkHeader()
            links.set({
                rel: relationship,
                uri: previousPath
            })
            response.header('link', JSON.stringify(links.refs))
            response.json({})
        })
    };

    @given('waychaser has a custom body handler')
    public waychaserHasACustomBodyHandler() {
        this.waychaser = this.waychaser.defaults({
            handlers: [{
                handler: (
                    baseResponse: Response,
                    content?: unknown,
                ) => {
                    if (content && typeof content === 'object' && 'customLinks' in content) {
                        const linkedContent = content as { customLinks: Record<string, { href: string }> }
                        return Object.keys(linkedContent.customLinks || {}).map(relationship => {
                            return new Operation({
                                rel: relationship,
                                uri: linkedContent.customLinks[relationship].href
                            })
                        })
                    }
                    else {
                        return []
                    }
                },
                mediaRanges: ['application/json']
            }]
        })
    };

    @given('waychaser has a custom stopping body _links handler')
    public waychaserHasACustomStoppingBody_linksHandler() {
        this.waychaser = this.waychaser.defaults({
            handlers: [{
                handler: (
                    baseResponse: Response,
                    content: unknown,
                    stopper: () => void
                ) => {
                    if (content && typeof content === 'object' && '_links' in content) {
                        const linkedContent = content as { '_links': Record<string, { href: string }> }
                        stopper()
                        return Object.keys(linkedContent._links || {}).map(relationship => {
                            return new Operation({
                                rel: relationship,
                                uri: linkedContent._links[relationship].href
                            })
                        })
                    }
                    else {
                        return []
                    }
                },
                mediaRanges: ['application/json']
            }]
        })
    };

    @given('a HAL endpoint returning the following with a {string} link that returns itself')
    public async aHALEndpointReturningTheFollowingWithAsLinkThatReturnsItself(relationship: string, bodyString: string) {
        const body = JSON.parse(bodyString)
        this.currentPath = randomApiPath()
        this.router.get(this.currentPath, async (request, response) => {
            const bodyOperations = {
                '_links': {
                    [relationship]: { href: this.currentPath }
                }
            }
            response.header('content-type', MediaTypes.HAL)
            response.json(Object.assign(body, bodyOperations))
        })
    };

    @given('a Siren endpoint returning the following with a {string} link that returns itself')
    public async aSirenResourceReturningTheFollowingWithAsLinkThatReturnsItself(relationship: string, bodyString: string) {
        const body = JSON.parse(bodyString)
        this.currentPath = randomApiPath()
        this.router.get(this.currentPath, async (request, response) => {

            const bodyOperations = createSirenLink(relationship, this.currentPath)
            response.header('content-type', MediaTypes.SIREN)
            response.json(Object.assign(body, bodyOperations))
        })
    };

    createResourceWithFragment(relationship: string, fragmentRelationship?: string) {
        const body = {
            title: 'Tale of the Wellerman',
            tableOfContents: [{ title: 'Chapter 1', page: 1 }]
        }
        this.currentFragment = body.tableOfContents
        const links = createLinks(relationship, `#/tableOfContents`)
        if (fragmentRelationship) {
            links.set({
                rel: fragmentRelationship,
                uri: `#/tableOfContents`,
                anchor: '#/tableOfContents'
            })
        }
        this.currentPath = randomApiPath()
        this.router.get(this.currentPath, async (request, response) => {
            response.header('link', links.toString())
            response.json(body)
        })
    }

    @given('a resource with a {string} operation that returns a fragment of the resource')
    public async aResourceWithAsOperationThatReturnsAFragmentOfTheResource(relationship: string) {
        this.createResourceWithFragment(relationship)
    };

    @given('a resource with a {string} operation that returns a fragment of the resource which has a {string} operation that returns itself')
    public async aResourceWithAsOperationThatReturnsAFragmentOfTheResourceWhichHasAsOperationThatReturnsItself(relationship: string, self: string) {
        this.createResourceWithFragment(relationship, self)
    };

    @given('waychaser is using a HAL handler')
    public async waychaserIsUsingAHalHandler() {
        // no op
    };

    @given('waychaser is using aws4 signing fetcher')
    public async waychaserIsUsingAws4SigningFetcher() {
        if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
            return 'skipped'
        }
        this.waychaser = this.waychaser.defaults({ fetch: awsFetch })
    };

    @given('Assuming a HAL API is available at {string}')
    public async assumingAHalApiIsAvailableAts(url: string) {
        const response = await awsFetch(url)
        if (!response.ok) {
            logger.error(`URL not available: ${url}`)
            logger.error(`status code: ${response.statusText} ${response.status}`)
            return 'skipped'
        }
        this.currentPath = url
    };

    @given('a HAL endpoint with {string} links to the two previous endpoints named {string} and {string}')
    public async aHALEndpointWithLinksToTheTwoPreviousEndpointsNamedAnd(relationship: string, nameOne: string, nameTwo: string) {
        const _links = {
            [relationship]: [
                { href: this.previousPath, name: nameOne },
                { href: this.currentPath, name: nameTwo }
            ]
        }
        this.currentPath = randomApiPath()
        this.router.get(this.currentPath, async (request, response) => {
            response.header('content-type', MediaTypes.HAL)
            response.status(200).send({
                _links
            })
        })
    };

    @given('a HAL endpoint with a {string} operation that returns that endpoint and has the following curies')
    public async aHALEndpointWithAsOperationThatReturnsThatEndpointAndHasTheFollowingCuries(relationship: string, curies: DataTable) {
        const previousPath = this.currentPath
        this.previousPath = previousPath
        this.currentPath = randomApiPath()
        this.router.get(this.currentPath, async (request, response) => {
            const bodyOperations = {
                '_links': {
                    curies: curies.hashes().map(curie => {
                        return {
                            name: curie.NAME,
                            href: curie.HREF,
                            templated: true
                        }
                    }),
                    [relationship]: { href: previousPath }
                }
            }
            response.header('content-type', MediaTypes.HAL)
            response.json(bodyOperations)
        })
    };

    @given('Assuming a Siren API is available at {string}')
    public async assumingASirenAPIIsAvailableAts(url: string) {
        const response = await nodeFetch(url, {
            headers: {
                accept: 'application/vnd.siren+json'
            }
        })
        if (!response.ok) {
            return 'skipped'
        }
    };

    @when('waychaser loads that endpoint')
    async loadResource() {
        console.log('loading', this.currentPath)
        this.response = await this.waychaser(new URL(this.currentPath, this.baseUrl).toString())
    }

    @when('waychaser successfully loads the first endpoint in the list')
    public async waychaserSuccessfullyLoadsTheFirstResourceInTheList() {
        await this.loadResource()
    };

    @when('waychaser successfully loads that endpoint')
    @when('waychaser successfully loads the latter endpoint')
    public async waychaserSuccessfullyLoadsThatEndpoint() {
        this.response = await this.waychaser(new URL(this.currentPath, this.baseUrl).toString())
        expectIsWayChaserResponse(this.response)
        expect(this.response.ok).to.be.true
    };

    @then('the response will have no operations')
    public hasNoOperations() {
        this.hasOperations(0)
    }


    @then('the response will have {int} operation(s)')
    public hasOperations(
        expected: number
    ) {
        expect(this.response?.ops.length).to.equal(expected)
    }

    @then('the response will have {int} {string} operations')
    public async theResponseWillHaveOperations(count: number, relationship: string) {
        expect(this.response?.ops.filter(relationship).length).to.equal(count)
    };

    @then('the response will have a {string} operation')
    @then('the response will have an {string} operation')
    public async theResponseWillHaveAnsOperation(relationship: string) {
        this.theResponseWillHaveOperations(1, relationship)
    };

    @then('when invokeAll is called on the {string} Operation, {int} items will be returned')
    public async whenInvokeAllIsCalledOnTheOperationsItemsWillBeReturned(relationship: string, count: number) {
        this.items = await this.response?.invokeAll('item')
        expect(this.items?.length).to.equal(count)
    };

    @then('each {string} will have a {string} operation')
    public async eachWillHaveAsOperation(eachRelationship: string, haveRelationship: string) {
        expectIsWayChaserResponse(this.response)
        const items = await this.response.invokeAll(eachRelationship)
        expect(items.map(item => item.ops.find(haveRelationship)?.rel)).to.deep.equal(items.map(() => haveRelationship))
    };

    @then('it/the\\ response will have a {string} operation')
    public theResponseWillHaveAOperation(relationship) {
        expect(this.response?.ops.find(relationship)).to.not.be.undefined
        this.expectedOperations = [relationship]
    };

    @then('it/the\\ response won\'t have any other operations')
    public theResponseWontHaveAnyOtherOperations() {
        expect(this.response?.ops.filter(operation => this.expectedOperations.includes[operation.rel]).length).to.equal(0)
    };

    @then('it will have loaded successfully')
    loadedSuccessfully() {
        expectIsWayChaserResponse(this.response)
        expect(this.response?.ok).to.be.true
    }


    @then('it will NOT have loaded successfully')
    public itWillNOTHaveLoadedSuccessfully() {
        expect(this.response?.ok).to.be.false
    };

    @when('waychaser loads an endpoint that\'s not available')
    public async waychaserLoadsAnEndpointThatIsNotAvailable() {
        this.response = await this.waychaser(new URL(this.currentPath, this.baseUrl.replace(
            // eslint-disable-next-line security/detect-non-literal-regexp -- not regex DoS vulnerable
            new RegExp(`(:${API_PORT})?$`),
            ':33556'
        )).toString())
    };

    @when('we invoke the {string} operation')
    public async weInvokeTheOperation(relationship) {
        expectIsWayChaserResponse(this.response)
        console.log(relationship, 'loading...', this.response?.ops.find(relationship)?.uri)
        expect(this.response?.ops.find(relationship)).to.not.be.undefined
        this.response = await this.response?.invoke(relationship)
    };

    @when('we invoke the {string} operation with the headers')
    public async weInvokeTheOperationWithTheHeaders(relationship: string, dataTable: DataTable) {
        this.response = await this.response?.invoke(relationship, { headers: dataTable.rowsHash() })
    };

    @when('we successfully invoke the {string} operation')
    public async weSuccessfullyInvokeTheOperation(relationship) {
        await this.weInvokeTheOperation(relationship)
        expectIsWayChaserResponse(this.response)
        expect(this.response?.ok)
    };

    @when('we invoke the {string} operation for the {int}st item')
    @when('we invoke the {string} operation for the {int}rd item')
    @when('we invoke the {string} operation for the {int}th item')
    public async weInvokeTheOperationForThe1986thItem(relationship: string, index: number) {
        this.response = await this.response?.ops.filter(relationship)[index].invoke()
    };

    @when('invokes each of the {string} operations in turn {int} times')
    public async invokesEachOfTheOperationsInTurnsTimes(relationship, count) {
        for (let index = 0; index < count; index++) {
            await this.weSuccessfullyInvokeTheOperation(relationship)
        }
    };

    @when('we invoke the {string} operation with the input')
    public async weInvokeTheOperationWithTheInput(relationship: string, dataTable: DataTable) {
        this.expectedResponseContent = dataTable.rowsHash();
        expectIsWayChaserResponse(this.response)
        expect(this.response?.ops.find(relationship)).to.not.be.undefined
        this.response = await this.response?.invoke(relationship, { parameters: dataTable.rowsHash() })
    };

    @when('the following code is executed:')
    public async theFollowingCodeIsExecuted(code: string) {
        const stringFunction = `function (waychaser) {
            ${code}
          }`
        // eslint-disable-next-line security/detect-eval-with-expression -- we trust the feature file
        const parsedFunction = eval(`(${stringFunction})`) // eslint-disable-line no-eval -- we trust the feature file
        logger.debug(parsedFunction.toString())
        const response = await parsedFunction(this.waychaser)
        if (response === 'skipped') {
            return 'skipped'
        }
        else {
            this.response = response
        }
    };

    @when('we get the {string} schema for the {string} API gateway')
    public async weGetTheSchemaForTheAPIGateway(schemaName: string, gatewayName: string) {
        const api = await this.waychaser(
            'https://apigateway.ap-southeast-2.amazonaws.com/restapis'
        )
        const gatewaysList = await api.invokeAll<{ name: string }>('item')
        const gateway = gatewaysList.find(response => {
            return response instanceof WayChaserResponse && response.content.name === gatewayName
        })
        const models = await gateway?.invoke(
            'http://docs.aws.amazon.com/apigateway/latest/developerguide/restapi-restapi-models.html'
        )
        if (models) {
            const modelsList = await models.invokeAll<{ name: string, schema: string }>('item');
            const model = modelsList.find(response => {
                return response instanceof WayChaserResponse && response.content.name === schemaName
            })
            if (model && model instanceof WayChaserResponse) {
                this.awsSchema = JSON.parse(model.content.schema)
                return
            }
        }
        throw new Error(`Not able to get ${schemaName} schema`)
    };

    @when('we invoke the {string} operation for the link name {string}')
    public async weInvokeTheOperationForTheLinkNames(relationship: string, name: string) {
        this.previousResponse = this.response
        this.response = await this.response?.invoke({
            rel: relationship,
            name: name
        })
    };

    @then('invoking a missing operation will immediately return undefined')
    public invokingAMissingOperationWillImmediatelyReturnUndefined() {
        expect(this.response).to.not.be.undefined
        expect(this.response?.invoke('missing')).to.be.undefined
    };

    @then('the same response will be returned')
    public theSameResourceWillBeReturned() {
        expect(this.response?.response.url).to.equal(new URL(this.currentPath, this.baseUrl).toString())
    };

    @then('the former endpoint response will be returned')
    public theFormerEndpointResponseWillBeReturned() {
        expect(this.response?.response.url).to.equal(new URL(this.previousPath, this.baseUrl).toString())
    };

    @then('when we invoke the {string} operation for the link name {string}')
    public async whenWeInvokeTheOperationForTheLinkNames(relationship: string, name: string) {
        this.response = await this.previousResponse?.invoke({
            rel: relationship,
            name: name
        })
    };

    @then('the response will contain those values')
    public resourceReturnedWillContainThoseValues() {
        expectIsWayChaserResponse(this.response)
        expect(this.response.content).to.deep.equal(this.expectedResponseContent)
    };

    @then('the response will contain only')
    public resourceReturnedWillContainOnly(dataTable: DataTable) {
        expectIsWayChaserResponse(this.response)
        expect(this.response.content).to.deep.equal(dataTable.rowsHash())
    };

    @then('the response will contain')
    public async theResponseWillContain(documentString: string) {
        expectIsWayChaserResponse(this.response)
        expect(this.response.content).to.deep.equal(JSON.parse(documentString))
    };

    @then('the response will have the parameters')
    public async theResponseWillHaveTheParameters(dataTable: DataTable) {
        const expectedContext = dataTable.rowsHash();
        expect(this.response?.parameters).to.deep.equal(expectedContext)
    };

    @then('the response will have the status code {int}')
    public responseWillHaveTheStatusCodes(status: number) {
        expect(this.response?.status).to.equal(status)
    };


    @then('the last response returned will be the last endpoint in the list')
    public theLastResponseReturnedWillBeTheLastEndpointInTheList() {
        expect(this.response?.response.url).to.equal(new URL(this.lastPath, this.baseUrl).toString())
    };

    @then('the body without the links will contain')
    public theBodyWithoutTheLinksWillContain(documentString: string) {
        expectIsWayChaserResponse(this.response)
        const content = this.response.content
        expect(content && typeof content === 'object').to.be.true
        if (content && typeof content === 'object') {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { customLinks, _links, links, ...other } = content as Record<string, unknown>
            expect(other).to.deep.equal(JSON.parse(documentString))
        }

    }

    @then('the body will contain')
    public theBodyWillContain(documentString: string) {
        expectIsWayChaserResponse(this.response)
        const content = this.response.content
        expect(content).to.deep.equal(JSON.parse(documentString))

    };

    // Then('the fragment will be returned', async function () {
    //   })

    @then('the fragment will be returned')
    public async theFragmentWillBeReturned() {
        expectIsWayChaserResponse(this.response)
        const content = this.response.content
        expect(content).to.deep.equal(this.currentFragment)

    };

    @then('it will have a {string} operation that returns the same fragment')
    public async itWillHaveAsOperationThatReturnsTheSameFragment(relationship: string) {
        this.response = await this.response?.invoke(relationship)
        expect(this.response?.ok).to.be.true
        expectIsWayChaserResponse(this.response)
        expect(this.response.content).to.deep.equal(this.currentFragment)

    };

    @then('it will *not* have a {string} operation')
    public async itWillNotHaveAOperation(relationship: string) {
        expectIsWayChaserResponse(this.response)
        expect(this.response?.ops.find(relationship)).to.be.undefined
    };

    @then('it will have successfully downloaded a schema')
    public async itWillHaveSuccessfullyDownloadedASchema() {
        expect(this.awsSchema).to.not.be.undefined
    };

    @then('it have {int} operation(s)')
    public async itHavesOperation(count: number) {
        expect(this.response?.ops.length).to.equal(count)
    };

    @then('the {int}th item will be returned')
    public async the1986thItemWillBeReturned(index: number) {
        expectIsWayChaserResponse(this.response)
        expect(this.response.content).to.not.be.undefined
        expect(typeof this.response.content).to.equal('object')
        const content = this.response.content as Record<string, unknown>
        expect('id' in content).to.be.true
        expect(content.id).to.equal(index)

    };

    @then('the adventure will have started')
    public async theAdventureWillHaveStarted() {
        expect(this.response?.ops.find('move')
        ).to.not.be.undefined
    };

    @then('we will have completed the adventure')
    public async weWillHaveCompletedTheAdventure() {
        const returnOperation = this.response?.ops.find('return')
        expect(returnOperation).to.not.be.undefined
        expect(returnOperation?.title).to.equal('Return to the void.')
    };

    @then('the items will contain {string}')
    public async theItemsWillContains(expectedValuesString: string) {
        const expectedValues = JSON.parse(expectedValuesString)
        expect(expectedValues.length).to.equal(this.items?.length)
        for (const [index, item] of this.items?.entries() || []) {
            expectIsWayChaserResponse(item)
            expect(item.content).to.deep.equal(expectedValues[index])

        }
    };
}

function createSirenLink(relationship: string, previousPath: string) {
    return {
        'links': [
            { rel: [relationship], href: previousPath }
        ]
    };
}

function createLinks(relationship: string, uri: string, method?: string): LinkHeader {
    const links = new LinkHeader()
    links.set({
        rel: relationship,
        uri: uri,
        ...(method && { method })
    })
    return links
}

//   Then('the loaded resource will have {string} operation', async function(
//     relationship
//   ) {
//     await expectFindOne.bind(this)(relationship, assert.isDefined)
//   })

//   Then("it won't have a(n) {string} operation", async function(relationship) {
//     await expectFindOne.bind(this)(relationship, assert.isUndefined)
//   })

//   When('we successfully invoke the {string} operation', async function(
//     relationship
//   ) {
//     await invokeSuccessfully.bind(this)(this.results[0], relationship)
//   })

//   When('we invoke the {string} operation', async function(relationship) {
//     await invoke.bind(this)(this.results[0], relationship)
//   })

//   Then('the same response will be returned', async function() {
//     await checkUrls.bind(this)()
//   })

//   Then('the former resource will be returned', async function() {
//     await checkUrls.bind(this)(this.firstResourceRoute)
//   })

//   When(
//   'invokes each of the {string} operations in turn {int} times',
//     async function(relationship, count) {
//       for (let index = 0; index < count; index++) {
//         await invoke.bind(this)(this.results[0], relationship)
//       }
//     }
// )

//   Then(
//   'invoking a missing operation will immediately return undefined',
//     async function() {
//       const results = await this.waychaserProxy.invokeAll(
//         this.results[0],
//         'missing'
//       )
//       for (const result of results) {
//         expect(result).to.be.undefined
//       }
//     }
// )

//   Then(
//   'the last resource returned will be the last item in the list',
//     async function() {
//       await checkUrls.bind(this)(this.lastOnList)
//     }
// )

//   When(
//   'we invoke the {string} operation with the input',
//     { timeout: 3_600_000 },
//     async function(relationship, dataTable) {
//       // we store it in expectedBody, because we use in in the next step
//       this.expectedBody = dataTable.rowsHash()
//       await invoke.bind(this)(this.results[0], relationship, this.expectedBody)
//     }
// )

//   Then('resource returned will contain those values', async function() {
//     await checkBody.bind(this)(this.expectedBody)
//   })

//   Then('resource returned will contain only', async function(dataTable) {
//     const expectedBody = dataTable.rowsHash()
//     await checkBody.bind(this)(expectedBody)
//   })

//   Then('resource returned will have the status code {int}', async function(
//     statusCode
//   ) {
//     await checkStatusCode.bind(this)(statusCode)
//   })

//   Then('the body without the links will contain', async function(
//     documentString
//   ) {
//     const expectedBody = JSON.parse(documentString)
//     await checkBody.bind(this)(
//       expectedBody,
//       ({ _links, links, customLinks, ...actualBody }) => {
//         return actualBody
//       }
//     )
//   })

//   When('the body will contain', async function(documentString) {
//     const expectedBody = JSON.parse(documentString)
//     await checkBody.bind(this)(expectedBody)
//   })

// async function checkOperationCounts(expected) {
//   const operationsCounts = await this.waychaserProxy.getOperationsCounts(
//     this.results
//   )
//   for (const key in operationsCounts) {
//     expect(operationsCounts[key]).to.equal(expected)
//   }
// }

// async function invokeWithName(relationship, name) {
//   this.results = await this.waychaserProxy.invokeWithObjectQuery(
//     this.rootResourceResult,
//     {
//       rel: relationship,
//       name: name
//     }
//   )
// }

// When(
//   'we invoke the {string} operation for the link name {string}',
//   async function (relationship, name) {
//     await invokeWithName.bind(this)(relationship, name)
//   }
// )

// Then(
//   'when we invoke the {string} operation for the link name {string}',
//   async function (relationship, name) {
//     await invokeWithName.bind(this)(relationship, name)
//   }
// )

// Then('resource returned will contain', async function (documentString) {
//   const expectedBody = JSON.parse(documentString)
//   await checkBody.bind(this)(expectedBody)
// })

// When('we invoke the {string} operation with the headers', async function (
//   relationship,
//   dataTable
// ) {
//   const options = {
//     headers: dataTable.rowsHash()
//   }
//   await invoke.bind(this)(this.results[0], relationship, undefined, options)
// })

// Then('it will have {int} {string} operations', async function (
//   count,
//   relationship
// ) {
//   const operationsCounts = await this.waychaserProxy.getOperationsCounts(
//     this.results,
//     relationship
//   )
//   for (const key in operationsCounts) {
//     expect(operationsCounts[key]).to.equal(count)
//   }
// })

// Then('each {string} will have a {string} operation', async function (
//   getRelationship,
//   hasRelationship
// ) {
//   this.previousResult = this.results[0]
//   const counts = await this.waychaserProxy.getOperationsCounts(
//     this.results,
//     getRelationship
//   )
//   for (let nth = 0; nth < counts['0-operations']; nth++) {
//     const items = await this.waychaserProxy.invokeNth(
//       this.results[0],
//       getRelationship,
//       nth
//     )
//     for (const item of items) {
//       expect(item.success).to.be.true
//     }
//     const hasCounts = await this.waychaserProxy.getOperationsCounts(
//       items,
//       hasRelationship
//     )
//     for (const key in hasCounts) {
//       expect(hasCounts[key]).to.equal(1)
//     }
//   }
// })

// When('we invoke the {string} operation for the {int}th item', async function (
//   relationship,
//   nth
// ) {
//   this.previousResult = this.results[0]
//   this.results = await this.waychaserProxy.invokeNth(
//     this.results[0],
//     relationship,
//     nth
//   )
// })

// Then('the {int}th item will be returned', async function (nth) {
//   const bodies = await this.waychaserProxy.getBodies(this.results)
//   for (const body of bodies) {
//     expect(body.id).to.equal(nth)
//   }
// })
