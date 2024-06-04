import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Button, Row } from "antd";
import { useSelector } from "react-redux";
import CustomLayout from "../shared/components/Layout";
import { SUBSCRIPTION } from "../shared/utils/routePathConstants";
import { LANGUAGES_TYPE, LANGUAGE_DIRECTIONS } from "../shared/utils/enums";

const { EN } = LANGUAGES_TYPE;
const { RTL, LTR } = LANGUAGE_DIRECTIONS;

const QuizPage = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState({});
  const [animate, setAnimate] = useState(false);
  const landingData = useSelector((state) => state.landing.landingData);
  const languageData = useSelector((state) => state.language.language);
  const quizData = landingData?.pre_landing?.quiz?.questions?.[languageData];
  const totalQuestions = quizData?.length || 0;

  // store that result count after solved all quiz
  const storeResultCount = (currentCountCorrect) => {
    if (
      currentCountCorrect === 0 ||
      currentCountCorrect === 1 ||
      currentCountCorrect === 2
    ) {
      localStorage.setItem("result", 1);
    } else if (currentCountCorrect === 3 || currentCountCorrect === 4) {
      localStorage.setItem("result", 2);
    } else {
      localStorage.setItem("result", 3);
    }
    // if all quizes done then view subscription page
    if (currentQuestion === totalQuestions - 1) {
      if (languageData === EN.value) {
        navigate(SUBSCRIPTION);
      } else {
        navigate(`${SUBSCRIPTION}/${languageData}`);
      }
    }
  };

  // Answer option select change
  const handleAnswerChange = (answerItem) => {
    setCurrentQuestion((prevQuestion) =>
      Math.min(prevQuestion + 1, totalQuestions - 1)
    );
    setSelectedAnswer({
      ...selectedAnswer,
      [currentQuestion]: answerItem,
    });
    const updatedAnswerData = Object.values(selectedAnswer);
    const countCorrectAnswers = updatedAnswerData.filter(
      (item) => item.is_correct === "1"
    );
    storeResultCount(countCorrectAnswers.length);
  };

  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => {
      setAnimate(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [currentQuestion]);

  // Function to determine if the screen is in portrait mode
  const isPortrait = () => {
    // Check if window object is available (for SSR)
    if (typeof window !== "undefined") {
      // Check if portrait orientation
      return window.innerHeight > window.innerWidth;
    }
    // Default to portrait for SSR
    return true;
  };

  return (
    <CustomLayout>
      <div
        dir={languageData === EN.value ? LTR.value : RTL.value}
        className="quiz-mainContainer quiz-image"
      >
        {quizData?.[currentQuestion] && (
          <div className="quiz-content">
            <div
              className="quiz-question"
              dangerouslySetInnerHTML={{
                __html: quizData[currentQuestion].question.replace(
                  "<span>",
                  '<span style="color: #E4FF40;">'
                ),
              }}
            />
            <Row gutter={[16, 16]}>
              {quizData[currentQuestion].answers.map(
                (answerItem, answerIndex) => (
                  <Col
                    className={
                      answerItem?.image
                        ? "option-text-container"
                        : "option-without-image"
                    }
                    key={answerIndex}
                    xs={24}
                    sm={isPortrait ? 8 : 24}
                    md={8}
                    lg={8}
                    xl={8}
                  >
                    {answerItem?.image && (
                      <img
                        onClick={() => handleAnswerChange(answerItem)}
                        style={{
                          backgroundColor: answerItem.bg_color
                            ? answerItem.bg_color
                            : "rgb(64, 175, 255)",
                        }}
                        src={`${window.location.origin}/images/${answerItem.image}`}
                        className={`answers-image mt-20 cursor-pointer ${
                          animate && `animate-${answerItem.option}`
                        }`}
                        alt={`Answer ${answerIndex}`}
                      />
                    )}
                    <div
                      className={`answer-mainContainer ${
                        animate && `animate-${answerItem.option}`
                      }`}
                    >
                      <div className="custom-radio">
                        <Button
                          shape="circle"
                          size="large"
                          onClick={() => handleAnswerChange(answerItem)}
                          className={`custom-radio ${
                            answerItem?.option && "selected-option"
                          }`}
                        >
                          <span>{answerItem.option}</span>
                        </Button>
                      </div>
                      <p
                        className={`answer-label ${
                          answerItem?.text && "selected-label"
                        }`}
                        onClick={() => handleAnswerChange(answerItem)}
                      >
                        {answerItem.text}
                      </p>
                    </div>
                  </Col>
                )
              )}
            </Row>
          </div>
        )}
      </div>
    </CustomLayout>
  );
};

export default QuizPage;
