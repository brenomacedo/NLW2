import React, { useState, FormEvent, useEffect } from 'react'
import PageHeader from '../../components/PageHeader'
import Input from '../../components/Input'
import warningIcon from '../../assets/images/icons/warning.svg'
import './styles.css'
import Textarea from '../../components/TextArea'
import Select from '../../components/Select'
import api from '../../services/api'
import rocket from '../../assets/images/icons/rocket.svg'
import { useHistory } from 'react-router-dom'

interface User {
    id: number
    name: string
    avatar: string
    whatsapp: string
    bio: string
    email: string
    subject: string
    cost: number
}

const TeacherForm = () => {

    interface scheduleItem {
        week_day: string
        from: string
        to: string
    }

    const [user, setUser] = useState<User>()

    useEffect(() => {
        if(localStorage.getItem('token')) {
            api.defaults.headers.authorization = `Bearer ${localStorage.getItem('token')}`
            api.post('/auth').then(res => {
                setUser(res.data)
            }).catch(e => history.push('/'))
        } else {
            history.push('/')
        }
    }, [])

    const [scheduleItems, setScheduleItems] = useState<scheduleItem[]>([
        { week_day: '0', from: '', to: '' },
    ])

    const history = useHistory()

    const addNewScheduleItem = () => {
        setScheduleItems([...scheduleItems, { week_day: '0', from: '', to: '' }])
    }

    const handleCreateClass = (e: FormEvent) => {
        e.preventDefault()
        api.post(`/classes/${user?.id}`, {
            subject: user?.subject,
            cost: Number(user?.cost),
            schedule: scheduleItems
        }).then(resp => {
            alert('cadastro realizado com sucesso')
            history.push('/register-class-success')
        }).catch(err => alert('erro no cadastro'))
    }

    const setScheduleItemValue = (position: number, field: string, value: string) => {
        const newArray = scheduleItems.map((scheduleItem, index) => {
            if(index === position) {
                return {...scheduleItem, [field]: value}
            }

            return scheduleItem
        })

        setScheduleItems(newArray)
    }

    return (
        <div id='page-teacher-form' className='container'>
            <PageHeader title='Que incrível que você quer dar aulas.'
                description="O primeiro passo é preencher este formulário de inscrição."
            >
                <div className="message-header">
                    <img src={rocket} alt="rocket"/>
                    <h4>Prepare-se! Vai ser o máximo</h4>
                </div>
            </PageHeader>

            <main>
                <form onSubmit={handleCreateClass}>
                    <fieldset>
                        <legend>Seus dados</legend>
                        <div className="page-teacher-info">
                            <div className="page-teacher-info-user">
                                <img src={`http://localhost:3333/uploads/${user?.avatar}`} alt="user" className="page-teacher-profile"/>
                                <h3>{user?.name}</h3>
                            </div>
                            <Input name="whatsapp" readOnly label="Whatsapp" value={user?.whatsapp} />
                        </div>
                        <Textarea name='bio' readOnly label='Biografia' value={user?.bio} />
                    </fieldset>

                    <fieldset>
                        <legend>Sobre a aula</legend>
                        <Input value={user?.subject} readOnly name="subject" label="Matéria" />
                        <Input value={`R$ ${user?.cost}`} readOnly
                        name="cost" label="Custo da sua hora por aula" />
                    </fieldset>

                    <fieldset>
                        <legend>
                            Horários disponíveis
                            <button type='button' onClick={addNewScheduleItem}>+ Novo horário</button>
                        </legend>
                        
                        {scheduleItems.map((scheduleItem, index) => {
                            return (
                                <div key={scheduleItem.week_day} className="schedule-item">
                                    <Select value={scheduleItem.week_day}
                                    onChange={e => setScheduleItemValue(index, 'week_day', e.target.value)}
                                    options={[
                                        { value: '0', label: 'Segunda' },
                                        { value: '1', label: 'Terça' },
                                        { value: '2', label: 'Quarta' },
                                        { value: '3', label: 'Quinta' },
                                        { value: '4', label: 'Sexta' },
                                        { value: '5', label: 'Sábado' },
                                        { value: '6', label: 'Domingo' },
                                    ]} name="week_day" label="Dia da semana" />
                                    <Input name='from' label='das' type='time' value={scheduleItem.from}
                                    onChange={e => setScheduleItemValue(index, 'from', e.target.value)}/>
                                    <Input name='to' label='até' type='time' value={scheduleItem.to}
                                    onChange={e => setScheduleItemValue(index, 'to', e.target.value)}/>
                                </div>
                            )
                        })}
                    </fieldset>

                    <footer>
                        <p>
                            <img src={warningIcon} alt="Aviso importante"/> Importante! <br />
                            Preencha  todos os dados!
                        </p>
                        <button type='submit'>
                            Salvar cadastro
                        </button>
                    </footer>
                </form>
            </main>
        </div>
    )
}

export default TeacherForm