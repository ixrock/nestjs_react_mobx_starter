import type { QuizType } from "./quiz.types";

export const quizMock: QuizType = {
  "quizId": "1",
  "quizName": "Theme quiz test",
  "imageUrl": "https://www.google.com",
  "iconUrl": "https://www.google.com",
  "questions": [
    {
      "id": "63280f8cf4a73e5f0e362086",
      "question": "What do you call a person or an organization that lends money?",
      "choices": {
        "1": "Creditor",
        "2": "Debtor",
        "3": "Investor",
        "4": "None of the above"
      },
      "answerType": "SINGLE",
      "points": 1
    }, {
      "id": "62f219f8443d8a3ed1528a93",
      "question": "Bitcoin is created as a reward for a process known as?",
      "choices": {
        "1": "Wallet",
        "2": "Blockchain",
        "3": "Mining",
        "4": "Bubble"
      },
      "answerType": "SINGLE",
      "points": 1
    }
  ]
};

export default quizMock;