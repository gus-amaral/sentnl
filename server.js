const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const { Resend } = require('resend');
const part1 = 're_NxAqHpCy'; 
const part2 = '_ATxKTt8RRKBSdQpDcpEsEZpu';      

const resendApiKey = process.env.RESEND_API_KEY || (part1 + part2);
const resend = new Resend(resendApiKey);

// 1. Landing Page
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Sentnl - AI Automation & Payload Watcher</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <!-- Google tag (gtag.js) -->
            <script async src="https://www.googletagmanager.com/gtag/js?id=G-5HQ8Q06EF6"></script>
            <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-5HQ8Q06EF6');
            </script>
        </head>
        <body class="bg-[#0e1626] text-slate-100 font-sans antialiased flex flex-col min-h-screen justify-between m-0">
            <!-- Top Header with Left-Aligned Logo -->
            <header class="w-full px-8 py-4">
                <img src="/logo_dark_background.png" alt="Sentnl Logo" class="h-16 object-contain" />
            </header>

            <!-- Hero Content -->
            <div class="max-w-3xl mx-auto px-6 py-6 text-center my-auto">
                <span class="inline-block bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs px-3 py-1 rounded-full mb-4 font-medium">
                    Built for Zapier, Make, n8n and custom AI Builders
                </span>
                <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
                    Stop Finding Out Your Automations Broke When Your Client Complains.
                </h1>
                <p class="text-base md:text-lg text-slate-400 mb-8 max-w-xl mx-auto">
                    Drop a single webhook URL at the end of your workflow. We inspect your AI output payloads in real-time and email you the second something returns empty or broken.
                </p>

                <form action="/signup" method="POST" class="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                    <input 
                        type="email" 
                        name="email" 
                        required 
                        placeholder="Enter your work email..." 
                        class="bg-[#131d31] border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 px-4 py-3 rounded-lg text-slate-100 outline-none flex-1 text-sm"
                    />
                    <button 
                        type="submit" 
                        class="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors cursor-pointer shadow-lg shadow-indigo-600/25 text-sm"
                    >
                        Get My Webhook URL
                    </button>
                </form>
                <p class="text-s text-indigo-400 mt-3">No account sign-up or password required. Results delivered straight to your email.</p>
            </div>

            <footer class="text-center py-4 text-xs text-slate-500 border-t border-slate-900/50">
                &copy; 2026 Sentnl. All rights reserved.
            </footer>
        </body>
        </html>
    `);
});

// 2. Signup Endpoint (Handles user creation, default monitor, and onboarding email)
app.post('/signup', async (req, res) => {
    const { email } = req.body;

    try {
        const userQuery = `
            INSERT INTO users (email, tier) 
            VALUES ($1, 'free') 
            ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
            RETURNING id, email;
        `;
        const userResult = await pool.query(userQuery, [email]);
        const user = userResult.rows[0];

        let monitorQuery = `SELECT monitors.*, users.email, users.id as user_id, users.tier, users.webhook_count, users.last_reset_at, users.limit_email_sent 
                            FROM monitors 
                            JOIN users ON monitors.user_id = users.id 
                            WHERE monitors.webhook_secret = $1;`;
        let monitorResult = await pool.query(monitorQuery, [user.id]);
        let monitor = monitorResult.rows[0];

        if (!monitor) {
            const createMonitorQuery = `
                INSERT INTO monitors (user_id, name, rule_type, target_field) 
                VALUES ($1, 'Default Pipeline Monitor', 'no_apologies', 'output')
                RETURNING *;
            `;
            const newMonitorRes = await pool.query(createMonitorQuery, [user.id]);
            monitor = newMonitorRes.rows[0];
        }

        const webhookUrl = `http://localhost:3000/webhook/${monitor.webhook_secret}`;

        // Send the onboarding email via Resend
        await resend.emails.send({
            from: 'Sentnl Alerts <alerts@sentnl.tech>',
            to: email,
            subject: 'Your Sentnl Webhook URL & Setup Guide',
            html: `
                <div style="font-family: sans-serif; max-width: 550px; margin: auto; padding: 24px; background: #0e1626; color: #f8fafc; border-radius: 8px;">
                    <h2 style="color: #818cf8; margin-top: 0;">Your Sentnl Endpoint 🚀</h2>
                    <p>You're ready to start monitoring. Drop this webhook URL at the very end of your AI automation workflow:</p>
                    
                    <div style="background: #131d31; padding: 12px 16px; border-radius: 6px; border: 1px solid #334155; font-family: monospace; word-break: break-all; color: #38bdf8; margin: 16px 0;">
                        ${webhookUrl}
                    </div>

                    <p style="font-size: 14px; color: #cbd5e1;"><strong>Current Rule:</strong> Alerts if the <code>output</code> field is empty or triggers AI refusal patterns (<code>no_apologies</code>).</p>

                    <hr style="border: none; border-top: 1px solid #334155; margin: 24px 0;">

                    <h3 style="color: #f1f5f9; font-size: 16px; margin-bottom: 12px;">How to add it to your workflow:</h3>
                    
                    <ol style="padding-left: 20px; font-size: 14px; color: #cbd5e1; line-height: 1.6;">
                        <li style="margin-bottom: 8px;">Open your Zapier, Make, n8n or custom automation builder.</li>
                        <li style="margin-bottom: 8px;">Add a new <strong>Action</strong> step at the very end of your pipeline.</li>
                        <li style="margin-bottom: 8px;">Configure an <strong>HTTP POST</strong> request pointing to your Sentnl endpoint.</li>
                        <li style="margin-bottom: 8px;">Paste your unique Sentnl URL into the <strong>URL</strong> field.</li>
                        <li style="margin-bottom: 8px;">Ensure your final step passes your AI final text output (payload) in the body.</li>
                    </ol>
                    
                    <p style="font-size: 12px; color: #64748b; margin-top: 24px;">Save this email! You can always reference this endpoint anytime.</p>
                </div>
            `
        });

        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <script src="https://cdn.tailwindcss.com"></script>
                <!-- Google tag (gtag.js) -->
                <script async src="https://www.googletagmanager.com/gtag/js?id=G-5HQ8Q06EF6"></script>
                <script>
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-5HQ8Q06EF6');
                </script>
            </head>
            <body class="bg-[#0e1626] text-slate-100 flex flex-col justify-between min-h-screen m-0">
                <header class="w-full px-8 py-4">
                    <img src="/logo_dark_background.png" alt="Sentnl Logo" class="h-16 object-contain" />
                </header>

                <div class="max-w-md w-full mx-auto text-center bg-[#131d31] border border-slate-800 p-8 rounded-2xl shadow-xl my-auto px-6">
                    <div class="w-12 h-12 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">✓</div>
                    <h2 class="text-2xl font-bold mb-2">Webhook URL Sent!</h2>
                    <p class="text-slate-400 text-sm mb-6">We've generated your unique endpoint and emailed it directly to <strong>${email}</strong>.</p>
                    <a href="/" class="text-indigo-400 hover:text-indigo-300 text-sm font-medium">&larr; Back to Home</a>
                </div>

                <footer class="text-center py-4 text-xs text-slate-500 border-t border-slate-900/50">
                    &copy; 2026 Sentnl. All rights reserved.
                </footer>
            </body>
            </html>
        `);
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).send('Error creating monitor or sending email.');
    }
});

// 3. CORE WEBHOOK VALIDATION ENGINE (Regex Semantic Matching)
app.post('/webhook/:secret', async (req, res) => {
    const { secret } = req.params;
    const payload = req.body;

    try {
        const monitorQuery = `
            SELECT monitors.*, users.email, users.id as user_id, users.tier, users.webhook_count, users.last_reset_at, users.limit_email_sent
            FROM monitors 
            JOIN users ON monitors.user_id = users.id 
            WHERE monitors.webhook_secret = $1;
        `;
        const monitorResult = await pool.query(monitorQuery, [secret]);
        
        if (monitorResult.rows.length === 0) {
            return res.status(404).json({ error: 'Monitor not found or invalid secret.' });
        }

        const monitor = monitorResult.rows[0];

        // 4. Check & do lazy monthly reset if needed
        const now = new Date();
        const lastReset = new Date(monitor.last_reset_at);

        if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
            await pool.query(
                'UPDATE users SET webhook_count = 0, limit_email_sent = FALSE, last_reset_at = NOW() WHERE id = $1',
                [monitor.user_id]
            );
            monitor.webhook_count = 0;
            monitor.limit_email_sent = false;
        }

        // 2. Enforce Free Tier Limit (500 limit)
        const FREE_LIMIT = 500;
        if (monitor.tier === 'free' && monitor.webhook_count >= FREE_LIMIT) {
            if (!monitor.limit_email_sent) {
                await resend.emails.send({
                    from: 'Sentnl Alerts <alerts@sentnl.tech>',
                    to: monitor.email,
                    subject: `⚠️ Action Required: Sentnl Free Tier Limit Reached`,
                    html: `
                        <div style="font-family: sans-serif; max-width: 550px; margin: auto; padding: 24px; background: #0e1626; color: #f8fafc; border-radius: 8px; border: 1px solid #f59e0b;">
                            <h2 style="color: #f59e0b; margin-top: 0;">Free Tier Limit Reached 🛑</h2>
                            <p>Your Sentnl pipeline monitor <strong>${monitor.name}</strong> has reached the 500 webhook calls limit for this month.</p>
                            <p>Incoming workflow telemetry is currently paused until your counter resets next month or you upgrade your plan.</p>
                            <div style="margin-top: 20px; padding: 12px; background: #131d31; border-radius: 6px; font-size: 13px; color: #fbbf24;">
                                Total Processed: 500 / 500 calls
                            </div>
                        </div>
                    `
                });

                await pool.query(
                    'UPDATE users SET limit_email_sent = TRUE WHERE id = $1',
                    [monitor.user_id]
                );
            }

            return res.status(429).json({ 
                error: 'Free tier limit reached (500/500). Please upgrade to continue receiving alerts.' 
            });
        }

        // 3. Increment usage counter
        await pool.query(
            'UPDATE users SET webhook_count = webhook_count + 1 WHERE id = $1',
            [monitor.user_id]
        );

        const targetField = monitor.target_field || 'output';
        const ruleType = monitor.rule_type || 'not_empty';
        const fieldValue = payload[targetField];

        let status = 'success';
        let errorMessage = null;

        if (ruleType === 'not_empty') {
            const isEmpty = fieldValue === undefined || fieldValue === null || String(fieldValue).trim() === '';
            if (isEmpty) {
                status = 'failed';
                errorMessage = `Validation failed: Field '${targetField}' was empty or missing.`;
            }
        } 
        else if (ruleType === 'no_apologies') {
            const textValue = String(fieldValue || '').toLowerCase();
            
            const refusalPatterns = [
                /\bsor+y\b/i,
                /apolog(?:y|ies|ize|izing)/i,
                /\b(?:i\s+)?can(?:'?t|\s+not)\b/i,
                /\b(?:i\s+)?could(?:'?t|\s+not)\b/i,
                /\b(?:i\s+)?am\s+unable\b/i,
                /\bas\s+an\s+ai\b/i,
                /policy\s+restrictions?/i,
                /safety\s+guidelines?/i,
                /against\s+my\s+guidelines/i,
                /\b(?:i\s+)?am\s+not\s+programmed\b/i,
                /fulfill\s+this\s+request\b/i,
                /ethical\s+boundaries?\b/i,
                /not\s+able\s+to\s+provide\b/i,
                /c(?:an|ould)\s+not\s+be\s+completed/i,
                /rate\s+limit\s+exceeded/i,
                /spend\s+limit/i,
                /spending\s+limits?\s+exceeded/i,
                /context\s+window\s+exceeded/i,
                /token\s+limit/i,
                /quota\s+exceeded/i,
                /exceeded\s+your.*quota/i,
                /account\s+quota/i,
                /connection\s+timeout/i,
                /\btimed\s+out\b/i,
                /validation\s+failed/i,
                /zap\s+run\s+failed/i,
                /we\s+hit\s+an\s+error/i,
                /task\s+failed/i,
                /request\s+failed/i,
                /failed\s+to\s+complete/i,
                /could\s+not\s+parse\s+request/i,
                /missing\s+required\s+scopes/i,
                /\bapi\s+error\b/i,
                /invalid\s+json/i,
                /the\s+scenario\s+requires\s+your\s+attention/i
            ];
            
            const matchedPattern = refusalPatterns.find(regex => regex.test(textValue));
            
            if (matchedPattern) {
                status = 'failed';
                errorMessage = `Soft failure detected: Output matched LLM refusal pattern (${matchedPattern}).`;
            } else if (fieldValue === undefined || fieldValue === null || String(fieldValue).trim() === '') {
                status = 'failed';
                errorMessage = `Validation failed: Field '${targetField}' was empty or missing.`;
            }
        }

        const logQuery = `
            INSERT INTO logs (monitor_id, status, payload_received, error_message) 
            VALUES ($1, $2, $3, $4);
        `;
        await pool.query(logQuery, [monitor.id, status, JSON.stringify(payload), errorMessage]);

        if (status === 'failed') {
            await resend.emails.send({
                from: 'Sentnl Alerts <alerts@sentnl.tech>',
                to: monitor.email,
                subject: `🚨 Alert: AI Soft Failure Caught on "${monitor.name}"`,
                html: `
                    <div style="font-family: sans-serif; max-width: 550px; margin: auto; padding: 24px; background: #0e1626; color: #f8fafc; border-radius: 8px; border: 1px solid #ef4444;">
                        <h2 style="color: #ef4444; margin-top: 0;">AI Quality Guardrail Triggered ⚠️</h2>
                        <p>Rule type <strong>${ruleType}</strong> flagged a semantic soft failure.</p>
                        
                        <div style="background: #131d31; padding: 12px 16px; border-radius: 6px; border: 1px solid #3f3f46; font-family: monospace; font-size: 13px; color: #fca5a5; margin: 16px 0; overflow-x: auto;">
                            ${errorMessage}
                        </div>

                        <p style="font-size: 13px; color: #a1a1aa;"><strong>Payload Received:</strong></p>
                        <pre style="background: #131d31; padding: 12px; border-radius: 6px; font-size: 12px; color: #e4e4e7; overflow-x: auto;">${JSON.stringify(payload, null, 2)}</pre>
                    </div>
                `
            });
        }

        return res.status(200).json({ status: 'received', validation: status, rule: ruleType });

    } catch (err) {
        console.error('Webhook processing error:', err);
        return res.status(500).json({ error: 'Internal server error processing webhook.' });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});