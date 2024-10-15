import { fakerEN as faker } from "@faker-js/faker";
import { AnswerType, QuizType } from "./quiz.types";

export default function generateQuizMock(
  {
    questionsNum = 4,
    choicesNum = 4,
    maxPoints = 2,
  } = {}): QuizType {
  return {
    quizId: faker.string.uuid(),
    quizName: faker.company.catchPhrase(),
    imageUrl: faker.internet.url(),
    iconUrl: faker.internet.url(),
    questions: Array(questionsNum).fill(null).map(() => {
      return {
        id: faker.string.uuid(),
        question: faker.lorem.sentences(2),
        choices: Array(choicesNum).fill(null).reduce((choices, nothing, index) => {
          choices[index + 1] = faker.lorem.word();
          return choices;
        }, {}),
        answerType: faker.helpers.enumValue(AnswerType),
        points: faker.number.int(maxPoints)
      };
    })
  };
}
