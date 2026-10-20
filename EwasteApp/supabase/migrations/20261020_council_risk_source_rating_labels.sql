-- Council supplied risk matrices may use different risk band labels.
-- Do not impose the app's historical LOW/MODERATE/HIGH/EXTREME vocabulary.
alter table public.council_risk_matrix_cells
 drop constraint if exists council_risk_matrix_cells_rating_check;
alter table public.council_risk_matrix_cells
 add constraint council_risk_matrix_rating_source_label
 check(length(trim(rating)) between 2 and 80);
