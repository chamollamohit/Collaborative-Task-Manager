import { UserService } from "../UserService";
import { UserRepository } from "../../repositories/UserRepository";
import { ApiError } from "../../utils/ApiError";

// Mock the UserRepository

jest.mock("../../repositories/UserRepository");

describe("UserService Unit Tests", () => {
    let userService: UserService;
    let mockRepo: jest.Mocked<UserRepository>;

    beforeEach(() => {
        // Reset the fake repo before every test
        mockRepo = new UserRepository() as jest.Mocked<UserRepository>;

        // Inject the fake repo into the service
        userService = new UserService(mockRepo);
    });

    // TEST 1: Validation Logic
    test("should throw error if both name and password are empty", async () => {
        const userId = 1;
        const emptyData = { name: "", password: "" };

        // We EXPECT it to REJECT (Throw an error)
        await expect(userService.update(userId, emptyData)).rejects.toThrow(
            ApiError
        );
    });

    // TEST 2: Password Hashing Logic
    test("should hash the password before saving", async () => {
        const userId = 1;
        const rawPassword = "securePassword123";

        mockRepo.findById.mockResolvedValue({
            id: 1,
            name: "Test",
            email: "test@test.com",
        } as any);

        mockRepo.update.mockResolvedValue({
            id: 1,
            name: "Test",
            email: "test@test.com",
        } as any);

        // Call the service
        await userService.update(userId, { password: rawPassword });

        // Check if repo.update was called
        expect(mockRepo.update).toHaveBeenCalledTimes(1);

        // Get the arguments passed to repo.update
        const callArgs = mockRepo.update.mock.calls[0];
        const updateData = callArgs[1]; // The second argument is the data object

        // ASSERTION: The saved password should NOT be the raw password
        expect(updateData.password).not.toBe(rawPassword);

        // ASSERTION: It should be a valid bcrypt hash (starts with $2)
        expect(updateData.password).toMatch(/^\$2/);
    });

    // TEST 3: Correct Data Flow
    test("should call repository with correct name update", async () => {
        const userId = 1;
        const newName = "Updated Name";

        mockRepo.findById.mockResolvedValue({
            id: 1,
            name: "Old",
            email: "test@test.com",
        } as any);
        mockRepo.update.mockResolvedValue({
            id: 1,
            name: newName,
            email: "test@test.com",
        } as any);

        // Call Service
        await userService.update(userId, { name: newName });

        expect(mockRepo.update).toHaveBeenCalledWith(
            userId,
            expect.objectContaining({ name: newName })
        );
    });
});
