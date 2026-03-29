-- Adiciona controle de primeiro acesso
alter table public.oficinas 
add column if not exists senha_redefinida boolean default false;
