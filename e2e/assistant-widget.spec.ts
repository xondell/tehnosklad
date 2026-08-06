import { expect, test } from "@playwright/test";

test.describe("catalog assistant widget", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/ru");
    await page.getByRole("button", { name: "Помощник по каталогу" }).click();
  });

  test("cancel closes the assistant", async ({ page }) => {
    const dialog = page.getByRole("dialog", { name: "Помощник Техносклада" });

    await dialog.getByRole("button", { name: "Отменить" }).click();

    await expect(dialog).toBeHidden();
  });

  test("clear removes the conversation and entered question", async ({
    page,
  }) => {
    const dialog = page.getByRole("dialog", { name: "Помощник Техносклада" });
    const question = dialog.getByRole("textbox", {
      name: "Например: нужен холодильник",
    });
    await question.fill("Нужна стиральная машина");

    await dialog.getByRole("button", { name: "Очистить" }).click();

    await expect(question).toHaveValue("");
    await expect(
      dialog.getByText(
        "Здравствуйте! Помогу найти технику по актуальному каталогу.",
      ),
    ).toBeHidden();
  });

  test("catalog link navigates and closes the assistant", async ({ page }) => {
    const dialog = page.getByRole("dialog", { name: "Помощник Техносклада" });

    await dialog.getByRole("link", { name: "Открыть каталог" }).click();

    await expect(page).toHaveURL(/\/ru\/catalog$/);
    await expect(dialog).toBeHidden();
  });

  test("question field cannot grow beyond its width plus 20 pixels", async ({
    page,
  }) => {
    const question = page.getByRole("textbox", {
      name: "Например: нужен холодильник",
    });
    const dimensions = await question.evaluate((element) => ({
      width: element.getBoundingClientRect().width,
      maxHeight: Number.parseFloat(getComputedStyle(element).maxHeight),
    }));

    expect(dimensions.maxHeight).toBeGreaterThanOrEqual(dimensions.width + 19);
    expect(dimensions.maxHeight).toBeLessThanOrEqual(dimensions.width + 21);
  });
});
