import { fakerEN as faker } from "@faker-js/faker";
import { AnswerType, Question, QuizType } from "./quiz.types";

export default function generateQuizMock(
  {
    questionsNum = 4,
    choicesNum = 4,
    points = 1 // per valid answer to question (?)
  } = {}): QuizType {
  return {
    quizId: faker.string.uuid(),
    quizName: faker.company.catchPhrase(),
    imageUrl: faker.internet.url(),
    iconUrl: faker.internet.url(),
    questions: Array.from({ length: questionsNum }).map(() => {
      return {
        id: faker.string.uuid(),
        question: faker.lorem.sentences(2),
        choices: Array.from({ length: choicesNum }).reduce((choices, nothing, index) => {
          choices[index + 1] = faker.lorem.word();
          return choices;
        }, {}),
        answerType: faker.helpers.enumValue(AnswerType),
        points: faker.number.int(points)
      } as Question;
    })
  };
}
