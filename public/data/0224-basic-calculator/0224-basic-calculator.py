class Solution:
    def evaluate_expression(self, expression: str) -> int:
        expression = expression.replace("--", "+")
        operands = expression.split("+")
        operands = [operand for operand in operands if operand != '']
        results = []

        for operand in operands:
            is_first_negative = False
            if operand[0] == "-":
                is_first_negative = True

            sub_operands = operand.split('-')
            sub_operands = [sub_operand for sub_operand in sub_operands if sub_operand != '']
            subtotal = 0

            if is_first_negative:
                subtotal = -1 * int(sub_operands[0])
            else:
                subtotal = int(sub_operands[0])

            sub_operands.pop(0)

            for sub_operand in sub_operands:
                subtotal -= int(sub_operand)

            results.append(subtotal)

        total = 0

        for result in results:
            total += result

        return total

    def calculate(self, expression: str) -> int:
        expression = expression.replace(" ", "")
        open_parentheses = []
        end = 0
        i = 0

        while i < len(expression):
            if expression[i] == '(':
                open_parentheses.append(i)
            elif expression[i] == ')':
                end = i
                start = open_parentheses[-1]
                sub_expression = expression[start + 1:end]
                evaluated_value = self.evaluate_expression(sub_expression)
                new_expression = expression[:start] + str(evaluated_value) + expression[end + 1:]
                open_parentheses.pop()
                expression = new_expression
                i = start - 1

            i += 1

        return self.evaluate_expression(expression)