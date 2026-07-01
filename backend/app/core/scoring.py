from typing import Dict, List, Optional

from app.models.screening import ScreeningQuestion


def compute_screening_score(
    questions: List[ScreeningQuestion], answers: Dict[str, object]
) -> Optional[float]:
    points = 0.0
    max_points = 0.0

    for question in questions:
        raw = answers.get(str(question.id))
        if raw is None or raw == "":
            continue

        if question.type == "mcq":
            if question.correct_answer is None:
                continue
            max_points += 1
            if str(raw).strip().lower() == question.correct_answer.strip().lower():
                points += 1

        elif question.type == "rating":
            try:
                value = float(raw)
            except (TypeError, ValueError):
                continue
            value = max(0.0, min(10.0, value))
            max_points += 1
            points += value / 10.0

        # fill, truefalse, file: self-report / free text, not auto-scored

    if max_points == 0:
        return None
    return round((points / max_points) * 100, 1)
