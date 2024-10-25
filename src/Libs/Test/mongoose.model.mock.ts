export const getMongooseModelMock = () => {
  const mongooseModelMock = {
    find: jest.fn().mockReturnThis(),
    findOneAndUpdate: jest.fn().mockReturnThis(),
    findOne: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    lean: jest.fn(() => undefined),
  };
  return mongooseModelMock;
};
