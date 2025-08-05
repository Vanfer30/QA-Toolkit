import { useState } from "react";

type StepperProps = {
  count?: number;
  onChange?: (value: number) => void;
};

export default function Stepper({ count: _count = 0, onChange = () => {} }: StepperProps) {
  const [count, setCount] = useState(_count);

  const handleIncrement = () => {
    const newCount = count + 1;
    setCount(newCount);
    onChange(newCount); // ✅ No TypeScript error now
  };

  const handleDecrement = () => {
    const newCount = count - 1;
    setCount(newCount);
    onChange(newCount); // ✅
  };

  return (
    <div>
      <button data-cy="decrement" onClick={handleDecrement}>
        -
      </button>
      <span data-cy="counter">{count}</span>
      <button data-cy="increment" onClick={handleIncrement}>
        +
      </button>
    </div>
  );
}
