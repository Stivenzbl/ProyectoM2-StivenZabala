import { describe, expect, it } from "vitest"
import request from "supertest"
import { server } from "../server"

describe("Servidor", () => {

    describe("GET /", ( ) => {


        it("responde 200 con un mensaje de bienvenida", async () => {

            const response = await request(server).get("/")

            expect(response.status).toBe(200)
            expect(response.body.message).toBe('el server esta ok')

        })
    })

    





})


