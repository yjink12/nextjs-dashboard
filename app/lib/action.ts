'use server';
 
import { sql } from '@vercel/postgres';
import { z } from 'zod'; //스키마 선언 및 유효성 검사 라이브러리
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
 
const InvoiceSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});

// omit : 객체에서 키가 일치하는 프로퍼티를 제외한 새로운 객체 반환하는 함수
const CreateInvoice = InvoiceSchema.omit({ id: true, date: true }); //customerId, amount, status

const UpdateInvoice = InvoiceSchema.omit({ id: true, date: true });
 
export async function createInvoice(formData: FormData) {
    const { customerId, amount, status } = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status')
    });
    // 금액
    const amountInCents = amount * 100;
    // 송장 생성 날짜
    const date = new Date().toISOString().split('T')[0];

    await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;

    /**
     *  revalidatePath
     *    - 클라이언트 라우터 캐시
     *    - 사용자가 서버에 대한 요청 수를 줄이면서 경로 간을 빠르게 탐색 가능
     */
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, formData: FormData) {
    // parse : 유효성 검증
    console.log(id)
    console.log(formData)
    const { customerId, amount, status } = UpdateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
      });

    const amountInCents = amount * 100;

    await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
    `;

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
    await sql `DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
}
