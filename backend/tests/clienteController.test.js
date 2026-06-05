jest.mock("../models/clienteModel", () => ({
    listarTodos: jest.fn(),
    buscarPorId: jest.fn(),
    criar: jest.fn(),
    atualizar: jest.fn(),
    deletar: jest.fn()
}));

const Cliente = require("../models/clienteModel");
const controller = require("../controllers/clienteController");

function mockResponse() {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}

describe("Testes do ClienteController", () => {

    test("Deve listar todos os clientes", () => {
        const req = {};
        const res = mockResponse();

        const clientes = [
            { id: 1, nome: "Maria", telefone: "67999999999" }
        ];

        Cliente.listarTodos.mockImplementation((callback) => {
            callback(null, clientes);
        });

        controller.listar(req, res);

        expect(res.json).toHaveBeenCalledWith(clientes);
    });

    test("Deve buscar cliente por ID", () => {
        const req = { params: { id: 1 } };
        const res = mockResponse();

        const cliente = [{ id: 1, nome: "Maria" }];

        Cliente.buscarPorId.mockImplementation((id, callback) => {
            callback(null, cliente);
        });

        controller.buscar(req, res);

        expect(res.json).toHaveBeenCalledWith(cliente[0]);
    });

    test("Deve retornar erro se cliente não for encontrado", () => {
        const req = { params: { id: 99 } };
        const res = mockResponse();

        Cliente.buscarPorId.mockImplementation((id, callback) => {
            callback(null, []);
        });

        controller.buscar(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            mensagem: "Cliente não encontrado"
        });
    });

    test("Deve cadastrar um cliente", () => {
        const req = {
            body: {
                nome: "Ana",
                telefone: "67999999999",
                email: "ana@gmail.com",
                cpf: "00000000000",
                nascimento: "2000-01-01"
            }
        };

        const res = mockResponse();

        Cliente.criar.mockImplementation((dados, callback) => {
            callback(null, { insertId: 1 });
        });

        controller.criar(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            mensagem: "Cliente cadastrado com sucesso",
            id: 1
        });
    });

    test("Deve deletar um cliente", () => {
        const req = { params: { id: 1 } };
        const res = mockResponse();

        Cliente.deletar.mockImplementation((id, callback) => {
            callback(null);
        });

        controller.deletar(req, res);

        expect(res.json).toHaveBeenCalledWith({
            mensagem: "Cliente deletado com sucesso"
        });
    });

});