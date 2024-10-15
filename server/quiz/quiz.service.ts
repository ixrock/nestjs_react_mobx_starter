import { Injectable } from "@nestjs/common";
import { QuizAnswer, QuizId, QuizResultType, QuizSubmitDto, QuizType } from "./quiz.types";
import generateQuizMock from "./quiz.mock";

@Injectable()
export class QuizService {
  private quizList: QuizType[] = [
    generateQuizMock({ questionsNum: 3, maxPoints: 1 }),
    generateQuizMock({ questionsNum: 5, choicesNum: 3 }),
    generateQuizMock({ questionsNum: 3, choicesNum: 3 })
  ];

  // for the sake of simplicity, we keep quiz results in memory:
  // in real world scenario this should be provided from a database, e.g. with "@nestjs/typeorm"
  private quizResultsPerUser: Record<string, Record<QuizId, QuizAnswer[]>> = {};

  async findQuizBy(id: QuizId): Promise<QuizType | undefined> {
    return this.quizList.find(quiz => quiz.quizId === id);
  }

  async findAvailableQuiz(userName: string): Promise<QuizType> {
    const answeredQuizIds = Object.keys(this.quizResultsPerUser[userName] || {});
    const availableQuizList = this.quizList.filter(quiz => !answeredQuizIds.includes(quiz.quizId));

    if (availableQuizList.length > 0) {
      return availableQuizList[Math.floor(Math.random() * availableQuizList.length)];
    }
  }

  async findQuizResult(userName: string, quizId: QuizId): Promise<QuizResultType> {
    const quiz = await this.findQuizBy(quizId);
    const answers = this.quizResultsPerUser[userName]?.[quizId];

    if (!quiz || !answers) {
      return;
    }

    // FIXME: fake score calculations
    return {
      quizId,
      quizName: quiz.quizName,
      totalScore: 100,
      userScore: 50,
      resultDetails: answers.map(({ questionId, answers }) => {
        const question = quiz.questions.find(question => question.id === questionId);
        return {
          questionId,
          question: question.question,
          correctAnswer: "1",
          userAnswer: answers.join(", "),
          isCorrect: true
        };
      })
    };
  }

  async submitQuiz(userName: string, { quizId, answers }: QuizSubmitDto): Promise<boolean> {
    this.quizResultsPerUser[userName] ??= {};

    const userHasAnswersForTheQuiz = this.quizResultsPerUser[userName][quizId];
    if (userHasAnswersForTheQuiz) return false;

    this.quizResultsPerUser[userName][quizId] = answers;
    return true;
  }
}
