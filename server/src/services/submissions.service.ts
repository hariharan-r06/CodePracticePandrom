import { supabaseAdmin } from '../config/supabase'
import { storageService } from './storage.service'
import { notificationsService } from './notifications.service'

export const submissionsService = {
    async getSubmissionsByStudent(studentId: string, filters: any = {}) {
        let query = supabaseAdmin
            .from('submissions')
            .select('*, problems(title, difficulty, platform, pattern_id, patterns(name))')
            .eq('student_id', studentId)

        if (filters.status) query = query.eq('status', filters.status)

        const { data, error } = await query.order('submitted_at', { ascending: false })
        if (error) throw error
        return data
    },

    async getAllSubmissions(filters: any = {}) {
        let query = supabaseAdmin
            .from('submissions')
            .select('*, profiles!student_id(full_name), problems(title, difficulty, platform)')

        if (filters.status) query = query.eq('status', filters.status)

        const { data, error } = await query.order('submitted_at', { ascending: false })
        if (error) throw error
        return data
    },

    async createSubmission(data: any, studentId: string, screenshotFile: Express.Multer.File) {
        const screenshotUrl = await storageService.uploadScreenshot(screenshotFile, studentId)

        const { data: submission, error } = await supabaseAdmin
            .from('submissions')
            .insert([{
                student_id: studentId,
                problem_id: data.problem_id,
                screenshot_url: screenshotUrl,
                notes: data.notes,
                status: 'pending'
            }])
            .select('*, profiles!student_id(full_name), problems(title)')
            .single()

        if (error) throw error

        await notificationsService.broadcastToRole('admin', {
            type: 'new_submission',
            title: 'New Submission Received 📬',
            message: `${submission.profiles.full_name} submitted a solution for '${submission.problems.title}'. Awaiting your review.`,
            meta: { studentName: submission.profiles.full_name, problemTitle: submission.problems.title, studentId }
        })

        return submission
    },

    async reviewSubmission(id: string, data: any, adminId: string) {
        const { data: submissions, error } = await supabaseAdmin
            .from('submissions')
            .update({
                status: data.status,
                feedback: data.feedback,
                reviewed_by: adminId,
                reviewed_at: new Date().toISOString()
            })
            .eq('id', id)
            .select('*, problems(title)')

        if (error) throw error
        if (!submissions || submissions.length === 0) throw new Error('Submission not found')
        const submission = submissions[0]

        if (data.status === 'approved') {
            await notificationsService.notifyUser(submission.student_id, {
                type: 'submission_approved',
                title: 'Submission Approved ✅',
                message: `Your solution for '${submission.problems.title}' has been approved. Great work!`,
                meta: { problemTitle: submission.problems.title, submissionStatus: 'approved' }
            })
        } else if (data.status === 'rejected') {
            await notificationsService.notifyUser(submission.student_id, {
                type: 'submission_rejected',
                title: 'Submission Needs Revision',
                message: `Your solution for '${submission.problems.title}' was rejected. Feedback: ${data.feedback}`,
                meta: { problemTitle: submission.problems.title, submissionStatus: 'rejected', feedbackNote: data.feedback }
            })
        }

        return submission
    },

    async getSubmissionStats(studentId?: string) {
        let subQuery = supabaseAdmin.from('submissions').select('status')
        if (studentId) subQuery = subQuery.eq('student_id', studentId)

        const { data, error } = await subQuery
        if (error) throw error

        const { count: totalProblems, error: probError } = await supabaseAdmin
            .from('problems')
            .select('*', { count: 'exact', head: true })

        if (probError) throw probError

        const stats = {
            total: data.length,
            approved: data.filter(s => s.status === 'approved').length,
            pending: data.filter(s => s.status === 'pending').length,
            rejected: data.filter(s => s.status === 'rejected').length,
            totalProblems: totalProblems || 0
        }

        return stats
    }
}
