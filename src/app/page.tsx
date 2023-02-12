'use client';
import * as React from "react";
import { useRouter } from 'next/navigation';
import styles from "./homepage.module.scss";
import { TextField, Button, Box, Tab, Tabs, Stack, FormControl } from "@mui/material";
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}
export default function Home() {
    const router = useRouter();
    function TabPanel(props: TabPanelProps) {
        const { children, value, index, ...other } = props;
        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                className={styles.tabPanel}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ pl: 3, pr: 3 }}>
                        {children}
                    </Box>
                )}
            </div>
        );
    }
    const handleEmailChange= (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };
    async function handleEmailSend(event: React.FormEvent) {
        event.preventDefault();
        try {
            const res = await fetch('/api/subscribe', {
                method: 'POST',
                body: JSON.stringify({email}),
            });
            if(res.status === 204) {
                // TODO because of lack of time -> just alert here. Should be some integrated indicator instead
                alert('Email was already registered');
            } else {
                const data = await res.json();
                if(res.status !== 200) {
                    alert('Error: '+data.error);
                }
                if(data.accessToDashboard) {
                    router.push('/dashboard')
                }
            }
        } catch(e) {
            console.error('here', e);
        }
        return false;
    }
    const [currentTab, setCurrentTab] = React.useState(0);
    const [email, setEmail] = React.useState('');
    const handleCurrentTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };
    /*
     in proper enterprise environment I would have forced the Material UI layout.
     However, I'm going to use only things that actually save time right now
     than just writing a couple of styles here
    */
  return (
    <main className={ styles.homepage }>
        <div className={ styles.topHalf }>
            <div className={ styles.topHalf_content }>
                <div className={ styles.topHalf_logo}>
                    <Stack direction="column" justifyContent="center" alignItems="center" flexGrow="1" sx={{color: 'common.white'}}>
                        <h2>&lt;logo&gt;AI Task manager</h2>
                        <span className={styles.topHalf_motto}>Your solution of the future!</span>
                    </Stack>
                </div>
                <form onSubmit={ handleEmailSend } className={ styles.topHalf_form }>
                    <Stack spacing={2} direction="column" justifyContent="center" alignItems="center" flexGrow="1" sx={{color: 'common.white'}}>
                        <span>Be the first to try out the future of Task Management!</span>
                        <Stack spacing={2} direction="row">
                            <TextField required placeholder="Enter email" variant="outlined" value={email} onChange={handleEmailChange}></TextField>
                            <Button type="submit" variant="contained">Subscribe</Button>
                        </Stack>
                    </Stack>
                </form>
            </div>
        </div>
        {/*This would actually just be the second page with scrolling. But this is just easier and faster*/}
        <div className={ styles.bottomHalf }>
            <Box sx={{ width: '100%'}}>
                <Box sx={{ backgroundColor: 'text.secondary'}}>
                    <Tabs value={currentTab} onChange={handleCurrentTabChange} aria-label="AI Task Manager Explained" centered>
                        <Tab label="Features"/>
                        <Tab label="Integrations"/>
                        <Tab label="Ease of Connection"/>
                        <Tab label="Benefits"/>
                    </Tabs>
                </Box>
                <Stack spacing={2} direction="row" justifyContent="center" alignItems="center" minWidth="30em">
                    <TabPanel value={currentTab} index={0}>
                        <h4>Our features include:</h4>
                        <ol>
                            <li>Task Management of the future</li>
                            <li>Automated report system</li>
                            <li>Time-Tracking and prediction system</li>
                            <li>AI-assisted Task Management</li>
                        </ol>
                    </TabPanel>
                    <TabPanel value={currentTab} index={1}>
                        <h4>Currently we are going to support these:</h4>
                        <ol>
                            <li>Messengers: Slack, Teams</li>
                            <li>Calls: Slack, Teams, Google Meet</li>
                            <li>Calendar APIs</li>
                            <li>Email Systems</li>
                        </ol>
                    </TabPanel>
                    <TabPanel value={currentTab} index={2}>
                        <h4>To gain full benefits:</h4>
                        <ol>
                            <li>Authorize in our system</li>
                            <li>Add our bot to your Slack, Meet, Teams etc</li>
                            <li>Give him admin rights</li>
                            <li>Enjoy the benefits of the future technology!</li>
                        </ol>
                    </TabPanel>
                    <TabPanel value={currentTab} index={3}>
                        <h4>Sed ut perspiciatis unde omnis</h4>
                        <ol>
                            <li>Accusantium doloremque</li>
                            <li>Totam rem aperiam</li>
                            <li>Eaque ipsa quae ab</li>
                            <li>Minima veniam!</li>
                        </ol>
                    </TabPanel>
                </Stack>
            </Box>
        </div>
    </main>
  )
}